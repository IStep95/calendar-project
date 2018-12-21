using System;
using System.Collections.Generic;

namespace calendarAPI.Models
{
    public partial class Users
    {
        public Users()
        {
            Events = new HashSet<Events>();
        }

        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string SessionId { get; set; }
        public DateTime? DateOfBirth { get; set; }

        public ICollection<Events> Events { get; set; }
    }
}
