# calendar-project
Repository for calendar-project

# Generate model from database
dotnet ef dbcontext scaffold "Server=tcp:calendardb.database.windows.net,1433;Initial Catalog=Calendar_DB;Persist Security Info=False;User ID=istep;Password={password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;" Microsoft.EntityFrameworkCore.SqlServer -output-dir=Models --force;

# Calendar end point
http://calendarpwa.azurewebsites.net

# Calendar API end point
http://calendarpwaapi.azurewebsites.net

# Instructions
Publish api to azure with visual studio for mac
Publish calendar app: 
    With ng build --prod.
    Save /dist folder. 
    In real visual studio open --> website --> dist directory --> publish
    Publish it with visual studio. 

