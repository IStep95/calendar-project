using System;
using System.Collections.Generic;

namespace calendarAPI.Models
{
    public partial class Events
    {
        public int EventId { get; set; }
        public string Title { get; set; }
        public DateTime StartsAt { get; set; }
        public DateTime EndsAt { get; set; }
        public string Email { get; set; }
        public int? UserId { get; set; }

        public Users User { get; set; }
    }
}
