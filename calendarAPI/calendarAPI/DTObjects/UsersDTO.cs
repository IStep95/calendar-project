using System;
namespace calendarAPI.DTObjects
{
	public class UsersDTO
	{
		public int UserId { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string Email { get; set; }
		public string EnteredPassword { get; set; }
		public string SessionId { get; set; }
		public DateTime? DateOfBirth { get; set; }
	}
}