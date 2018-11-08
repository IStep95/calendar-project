using System;
using System.Collections.Generic;
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
			return new string[] { "Users" };
		}

		// GET api/users/5
		[HttpGet("{id}")]
		public ActionResult<Users> Get(int id)
		{
			Users user;
			using(var db = new Calendar_DBContext()) {
				user =  db.Users.Find(id);
			}

			return user;
		}

		// POST api/users
		[HttpPost]
		public void Post([FromBody] string value)
		{
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
	}
}
