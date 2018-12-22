using System;
using System.Collections.Generic;
using calendarAPI.DTObjects;
using calendarAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace calendarAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class EventsController : ControllerBase
	{

		// GET api/events/get/5
		[HttpGet("Get/{id}")]
		public ActionResult<EventsDTO> Get(int id)
		{
			Events events;
			using (var db = new Calendar_DBContext())
			{
				events = db.Find<Events>(id);
			}
			return convertModelToDTO(events);
		}

		// POST api/events/create
		[HttpPost("Create")]
		public ActionResult<EventsDTO> Create(EventsDTO eventsDTO)
		{
			using (var db = new Calendar_DBContext())
			{
				try
				{
					Events newEvent = convertDTOToModel(eventsDTO);
					db.Add<Events>(newEvent);
					db.SaveChanges();
					eventsDTO = convertModelToDTO(newEvent);
				} catch (Exception exc)
				{
					return BadRequest("Unsuccessful adding new event. " + exc.Message);
				}
			}
			return Ok(eventsDTO);
		}

		// GET api/events/getUserEvents/5
		[HttpGet("GetUserEvents/{id}")]
		public ActionResult<EventsDTO> GetUserEvents(int id)
		{
			List<Events> events = new List<Events>();
			List<EventsDTO> eventsDTOs = new List<EventsDTO>();
			try
			{
				using (var db = new Calendar_DBContext())
				{
					if (db.Users.Find(id) == null)
					{
						return BadRequest("User with specified id does not exist in database.");
					}
					foreach (Events element in db.Events)
					{
						if (element.UserId == id)
						{
							events.Add(element);
							eventsDTOs.Add(convertModelToDTO(element)); 
						}
					}
				}
			}
			catch (Exception ex)
			{
				return BadRequest("Can not return user events. Error: " + ex.Message);
			}
			return Ok(eventsDTOs);
		}

		private EventsDTO convertModelToDTO(Events events)
		{
			EventsDTO eventsDTO = new EventsDTO();
			eventsDTO.Title = events.Title;
			eventsDTO.StartsAt = events.StartsAt;
			eventsDTO.EndsAt = events.EndsAt;
			eventsDTO.Email = events.Email;
			eventsDTO.UserId = events.UserId;
			eventsDTO.EventId = events.EventId;

			return eventsDTO;
		}

		private Events convertDTOToModel(EventsDTO eventsDTO)
		{
			Events events = new Events();
			events.Title = eventsDTO.Title;
			events.StartsAt = eventsDTO.StartsAt;
			events.EndsAt = eventsDTO.EndsAt;
			events.Email = eventsDTO.Email;
			events.UserId = eventsDTO.UserId;
			events.EventId = eventsDTO.EventId;

			return events;
		}
	}
}
