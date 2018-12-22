using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Threading.Tasks;
using calendarAPI.DTObjects;
using calendarAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace calendarAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UsersController : ControllerBase
	{
		// GET api/users
		[HttpGet]
		public ActionResult<IEnumerable<string>> Get()
		{
			return new string[] { "Calendar API", "Users" };
		}

		// GET api/users/get/5
		[HttpGet("Get/{id}")]
		public ActionResult<Users> Get(int id)
		{
			Users user;
			using(var db = new Calendar_DBContext()) {
				user =  db.Users.Find(id);
			}

			return user;
		}

		[HttpGet("Proba")]
		public ActionResult<string> Proba()
		{
			return "mora radit";
		}

		[HttpPost("Authenticate")]
		public ActionResult<UsersDTO> Authenticate(UsersDTO value)
		{
			Users user = null;
			using (var db = new Calendar_DBContext())
			{
				foreach(Users entity in db.Users)
				{
					if (entity.Email == value.Email)
					{
						user = entity;
					}
				}
				if (user == null) return BadRequest("User with entered email does not exist.");
				if (user.PasswordHash != computePasswordHash(value.EnteredPassword)) return BadRequest("Wrong password.");

				user.SessionId = this.HttpContext.Session.Id;
				db.Users.Update(user);
				db.SaveChanges();
			}
			return Ok(user);
		}

		// POST api/users/create
		[HttpPost("Create")]
		public ActionResult<UsersDTO> Create(UsersDTO userDTO)
		{
			using (var db = new Calendar_DBContext())
			{
				try
				{

					Users user = convertUserDTOToUser(userDTO);
					user.PasswordHash = computePasswordHash(userDTO.EnteredPassword);
					user.SessionId = this.HttpContext.Session.Id;
					userDTO.SessionId = user.SessionId;

					db.Add(user);
					db.SaveChanges();
				}
				catch (Exception)
				{
					return BadRequest("User already exists with same email.");
				}
			}
			return Ok(userDTO);
		}

		// PUT api/users/5
		[HttpPut("{id}")]
		public void Put(int id, [FromBody] string value)
		{
		}

		// DELETE api/users/5
		[HttpDelete("{id}")]
		public void Delete(int id)
		{
		}

		private string computePasswordHash(string password)
		{
			var sha1 = new SHA1CryptoServiceProvider();
			var sha1data = sha1.ComputeHash(System.Text.Encoding.Default.GetBytes(password));
			return  System.Text.Encoding.Default.GetString(sha1data);
		}

		private Users convertUserDTOToUser(UsersDTO userDTO)
		{
			Users user = new Users();
			user.Email = userDTO.Email;
			user.FirstName = userDTO.FirstName;
			user.LastName = userDTO.LastName;
			user.DateOfBirth = userDTO.DateOfBirth;

			return user;
		}

		private UsersDTO convertUserToUserDTO(Users users)
		{
			UsersDTO usersDTO = new UsersDTO();
			usersDTO.Email = users.Email;
			usersDTO.FirstName = users.FirstName;
			usersDTO.LastName = users.LastName;
			usersDTO.DateOfBirth = users.DateOfBirth;
			usersDTO.SessionId = users.SessionId;

			return usersDTO;
		}
	}
}
