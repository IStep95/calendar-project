using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace calendarAPI.Models
{
    public partial class Calendar_DBContext : DbContext
    {
        public Calendar_DBContext()
        {
        }

        public Calendar_DBContext(DbContextOptions<Calendar_DBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Events> Events { get; set; }
        public virtual DbSet<Users> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=tcp:calendardb.database.windows.net,1433;Initial Catalog=Calendar_DB;Persist Security Info=False;User ID=istep;Password=2345Sedam;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Events>(entity =>
            {
                entity.HasKey(e => e.EventId);

                entity.Property(e => e.EventId).ValueGeneratedNever();

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.EndsAt).HasColumnType("date");

                entity.Property(e => e.StartsAt).HasColumnType("date");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Events)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK__Events__UserId__52593CB8");
            });

            modelBuilder.Entity<Users>(entity =>
            {
                entity.HasKey(e => e.UserId);

                entity.Property(e => e.UserId).ValueGeneratedNever();

                entity.Property(e => e.DateOfBirth).HasColumnType("date");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.FirstName).HasMaxLength(30);

                entity.Property(e => e.LastName).HasMaxLength(30);

                entity.Property(e => e.PasswordHash)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.SessionId).HasMaxLength(50);
            });
        }
    }
}
