﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LS.BLL.SQLRepository
{
    public static class StoredProcedure
    {
        public const string GetUsers = "[usp_GetUsers]";
        public const string GetLoginHistory = "[usp_GetLoginHistory]";
        public const string AddLoginHistory = "[usp_Add_Login_Histories]";
        public const string GetUsersWithNames = "[usp_GetUsersWithNames]";
        public const string UpdateUserRoles = "[usp_UpdateUserRole]";
    }
}
