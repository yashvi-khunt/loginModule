﻿// AuthService.cs
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Threading.Tasks;
using LS.BLL.Repositories;
using LS.DAL.Helper;
using LS.DAL.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace LS.BLL.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AuthService(UserManager<ApplicationUser> userManager, IConfiguration configuration, IEmailService emailService)
        {
            _userManager = userManager;
            _configuration = configuration;
            _emailService = emailService;
        }

        public async Task<object> Login(LoginModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);

            if (user == null || !user.EmailConfirmed || !await _userManager.CheckPasswordAsync(user, model.Password))
            {
                return new { Success = false, Message = "Invalid email or password" };
            }

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
            _ = int.TryParse(_configuration["JWT:TokenValidityInMinutes"], out int tokenValidityInMinutes);

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddMinutes(tokenValidityInMinutes),
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return new
            {
                Success = true,
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Expiration = token.ValidTo
            };
        }

        public async Task<object> Register(RegisterModel model)
        {
            var userExists = await _userManager.FindByEmailAsync(model.Email);
            if (userExists != null)
            {
                return new { Success = false, Message = "User with the same email already exists" };
            }

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                EmailConfirmed = false,
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                return new { Success = false, Message = string.Join(", ", result.Errors) };
            }

            try
            {
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var confirmationLink = $"http://localhost:5173/api/auth/confirmUserEmail?userId={user.Id}&token={token}";

                await _emailService.SendEmailAsync(new MailRequest
                {
                    RecipientEmail = model.Email,
                    Subject = "Confirmation Mail",
                    Body = $"Please confirm your email by clicking <a href='{confirmationLink}'>here</a>.",
                });

                return new { Success = true, Message = "User created successfully!" };
            }
            catch (Exception ex)
            {
                return new { Success = false, Message = ex.Message };
            }
        }

        public async Task<object> ConfirmEmail(string userId, string token)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return new { Success = false, Message = "User not found" };
            }

            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (result.Succeeded)
            {
                return new { Success = true, Message = "Email confirmed successfully" };
            }
            else
            {
                return new { Success = false, Message = "Failed to confirm email" };
            }
        }
    }
}