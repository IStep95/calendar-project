using System;
namespace calendarAPI
{
	public class LoginInfo
	{
		public LoginInfo(string email, string passwordHash)
		{
			Email = email;
			PasswordHash = passwordHash;
		}

		public string Email 			{ get; set; }
		public string PasswordHash 		{ get; set; }
	}
}
