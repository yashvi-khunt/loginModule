﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LS.DAL.Helper
{
    public class EmailSettings
    {
        public string SenderEmail { get; set; }
        public string Password { get; set; }
        public string Host {  get; set; }
        public string DisplayName{ get; set; }
        public int Port{ get; set; }

    }
}
