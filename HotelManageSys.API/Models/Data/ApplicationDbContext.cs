using HotelManageSys.API.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace HotelManageSys.API.Models.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }


        public DbSet<Room> Rooms { get; set; }
        public DbSet<RoomType> RoomTypes { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Amenity> Amenities { get; set; }
        public DbSet<AdditionalOffer> AdditionalOffers { get; set; }
        public DbSet<Guest> Guests { get; set; }
        public DbSet<Worker> Workers { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<ReservationAdditionalOffer> ReservationAdditionalOffers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Room>(r =>
            {
                r.HasKey(r => r.RoomId);
                r.Property(r => r.Number).HasMaxLength(10).IsRequired();
                r.Property(r => r.Floor).IsRequired();

                r.Property(r => r.Status).HasConversion<string>().IsRequired();

                r.Property(r => r.IsActive).IsRequired();

                r.HasOne(r => r.RoomType)
                    .WithMany(rt => rt.Rooms)
                    .HasForeignKey(r => r.RoomTypeId)
                    .OnDelete(DeleteBehavior.Restrict);


            });

            modelBuilder.Entity<RoomType>(rt =>
            {
                rt.HasKey(rt => rt.RoomTypeId);
                rt.Property(rt => rt.Name).HasMaxLength(80).IsRequired();
                rt.Property(rt => rt.BasePrice).HasColumnType("decimal(18,2)").IsRequired();
                rt.Property(rt => rt.Description).HasMaxLength(300);
                rt.Property(rt => rt.IsActive).IsRequired();

            });

            modelBuilder.Entity<Amenity>(a =>
            {
                a.HasKey(a => a.AmenityId);
                a.Property(a => a.Name).HasMaxLength(80).IsRequired();
                a.Property(a => a.Description).HasMaxLength(200);
                a.Property(a => a.IsActive).IsRequired();


            });

            modelBuilder.Entity<Reservation>(r =>
            {
                r.HasKey(r => r.ReservationId);
                r.Property(r => r.TotalPrice).HasColumnType("decimal(18,2)").IsRequired();
                r.Property(r => r.ReservationDate).IsRequired();
                r.Property(r => r.CheckInDate).IsRequired();
                r.Property(r => r.CheckOutDate).IsRequired();
                r.Property(r => r.ReservationStatus).HasConversion<string>().IsRequired();
                r.Property(r => r.IsActive).IsRequired();

                r.HasOne(r => r.Guest)
                    .WithMany(g => g.Reservations)
                    .HasForeignKey(r => r.GuestId)
                    .OnDelete(DeleteBehavior.Restrict);

                r.HasOne(r => r.Room)
                    .WithMany(r => r.Reservations)
                    .HasForeignKey(r => r.RoomId)
                    .OnDelete(DeleteBehavior.Restrict);

                r.HasOne(r => r.Worker)
                    .WithMany(w => w.Reservations)
                    .HasForeignKey(r => r.WorkerId)
                    .OnDelete(DeleteBehavior.Restrict);

            });

            modelBuilder.Entity<AdditionalOffer>(a =>
            {
                a.HasKey(a => a.AdditionalOfferId);
                a.Property(a => a.Name).HasMaxLength(80).IsRequired();
                a.Property(a => a.Price).HasColumnType("decimal(18,2)").IsRequired();
                a.Property(a => a.IsActive).IsRequired();


            });

            modelBuilder.Entity<ReservationAdditionalOffer>(rhs =>
            {
                rhs.HasKey(rhs => rhs.ReservationAdditionalOfferId);
                rhs.Property(rhs => rhs.Quantity).IsRequired();
                rhs.Property(rhs => rhs.Notes).HasMaxLength(300);
                rhs.Property(rhs => rhs.IsActive).IsRequired();

                rhs.HasOne(rhs => rhs.Reservation)
                    .WithMany(r => r.ReservationAdditionalOffers)
                    .HasForeignKey(rhs => rhs.ReservationId)
                    .OnDelete(DeleteBehavior.Cascade);

                rhs.HasOne(rhs => rhs.AdditionalOffer)
                   .WithMany(a => a.ReservationAdditionalOffers)
                   .HasForeignKey(rhs => rhs.AdditionalOfferId)
                   .OnDelete(DeleteBehavior.Restrict);


            });

            modelBuilder.Entity<Guest>(g =>
            {
                g.HasKey(g => g.GuestId);
                g.Property(g => g.FirstName).HasMaxLength(50).IsRequired();
                g.Property(g => g.LastName).HasMaxLength(50).IsRequired();
                g.Property(g => g.PhoneNumber).HasMaxLength(20).IsRequired();
                g.Property(g => g.Email).IsRequired();
                g.Property(g => g.IdentityCardNumber).HasMaxLength(20).IsRequired();
                g.Property(g => g.IsActive).IsRequired();



            });

            modelBuilder.Entity<Worker>(w =>
            {
                w.HasKey(w => w.WorkerId);
                w.Property(w => w.FirstName).HasMaxLength(50).IsRequired();
                w.Property(w => w.LastName).HasMaxLength(50).IsRequired();
                w.Property(w => w.Login).HasMaxLength(50).IsRequired();
                w.Property(w => w.Password).IsRequired();
                w.Property(w => w.IsActive).IsRequired();


            });

            modelBuilder.Entity<Payment>(p =>
            {

                p.HasKey(p => p.PaymentId);
                p.Property(p => p.Title).HasMaxLength(100).IsRequired();
                p.Property(p => p.PaymentStatus).HasConversion<string>().IsRequired();
                p.Property(p => p.PaymentMethod).HasConversion<string>().IsRequired();
                p.Property(p => p.Price).HasColumnType("decimal(18,2)").IsRequired();
                p.Property(p => p.PaymentDate).IsRequired();


                p.HasOne(p => p.Reservation)
                    .WithMany(r => r.Payments)
                    .HasForeignKey(p => p.ReservationId)
                    .OnDelete(DeleteBehavior.Cascade);


            });


            SeedData(modelBuilder);



        }

        private void SeedData(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<RoomType>().HasData(
                new RoomType { RoomTypeId = 1, Name = "Standard", BasePrice = 180, Description = "Pokój standardowy", IsActive = true },
                new RoomType { RoomTypeId = 2, Name = "Deluxe", BasePrice = 350, Description = "Pokój luksusowy", IsActive = true }
            );

            modelBuilder.Entity<Room>().HasData(
                new Room { RoomId = 1, Number = "101", Floor = 1, RoomTypeId = 1, Status = RoomStatus.AVAILABLE, IsActive = true },
                new Room { RoomId = 2, Number = "201", Floor = 2, RoomTypeId = 2, Status = RoomStatus.AVAILABLE, IsActive = true }
            );

            modelBuilder.Entity<Amenity>().HasData(
                new Amenity { AmenityId = 1, Name = "WiFi", Description = "Darmowe wifi", IsActive = true },
                new Amenity { AmenityId = 2, Name = "AC", Description = "Klimatyzacja", IsActive = true }
            );

            modelBuilder.Entity<AdditionalOffer>().HasData(
                new AdditionalOffer { AdditionalOfferId = 1, Name = "Śniadanie", Price = 40, IsActive = true },
                new AdditionalOffer { AdditionalOfferId = 2, Name = "Parking", Price = 25, IsActive = true }
            );

            modelBuilder.Entity<Worker>().HasData(
                new Worker { WorkerId = 1, FirstName = "Adam", LastName = "Kowalski", Login = "admin", Password = "admin123", IsActive = true }
            );

            modelBuilder.Entity<Guest>().HasData(
                new Guest { GuestId = 1, FirstName = "Mariusz", LastName = "Pudzianowski", Email = "pudzian@test.pl", PhoneNumber = "123567345", IdentityCardNumber = "ID123", IsActive = true }
            );

        }

    }
}
