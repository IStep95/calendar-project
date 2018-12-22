using System;
namespace calendarAPI.DTObjects
{
	public class EventsDTO
	{
		public int EventId { get; set; }
		public string Title { get; set; }
		public DateTime StartsAt { get; set; }
		public DateTime EndsAt { get; set; }
		public string Email { get; set; }
		public int? UserId { get; set; }
	}
}
