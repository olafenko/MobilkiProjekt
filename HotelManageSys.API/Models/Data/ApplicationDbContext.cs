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
                r.Property(r => r.Notes);
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
                rhs.Property(rhs => rhs.OfferPrice).HasColumnType("decimal(18,2)").IsRequired(); ;
                rhs.Property(rhs => rhs.Notes).HasMaxLength(300);
                rhs.Property(rhs => rhs.IsActive).IsRequired();

                rhs.HasOne(rhs => rhs.Reservation)
                    .WithMany(r => r.ReservationAdditionalOffers)
                    .HasForeignKey(rhs => rhs.ReservationId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade);

                rhs.HasOne(rhs => rhs.AdditionalOffer)
                   .WithMany(a => a.ReservationAdditionalOffers)
                   .HasForeignKey(rhs => rhs.AdditionalOfferId)
                   .IsRequired()
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
                w.Property(w => w.Role).HasConversion<string>().IsRequired();
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
                new RoomType { RoomTypeId = 1, Name = "Standard", BasePrice = 180m, Description = "Wygodny pokój standardowy 1-2 os.", IsActive = true },
                new RoomType { RoomTypeId = 2, Name = "Deluxe", BasePrice = 350m, Description = "Pokój o podwyższonym standardzie z widokiem", IsActive = true },
                new RoomType { RoomTypeId = 3, Name = "Apartament VIP", BasePrice = 700m, Description = "Przestronny apartament z aneksem kuchennym", IsActive = true },
                new RoomType { RoomTypeId = 4, Name = "Rodzinny", BasePrice = 450m, Description = "Idealny pokój dla rodziny 2+2", IsActive = true }
            );

 
            modelBuilder.Entity<Room>().HasData(
                new Room { RoomId = 1, Number = "101", Floor = 1, RoomTypeId = 1, Status = RoomStatus.AVAILABLE, IsActive = true },
                new Room { RoomId = 2, Number = "102", Floor = 1, RoomTypeId = 1, Status = RoomStatus.OCCUPIED, IsActive = true },
                new Room { RoomId = 3, Number = "103", Floor = 1, RoomTypeId = 4, Status = RoomStatus.OCCUPIED, IsActive = true },
                new Room { RoomId = 4, Number = "201", Floor = 2, RoomTypeId = 2, Status = RoomStatus.AVAILABLE, IsActive = true },
                new Room { RoomId = 5, Number = "202", Floor = 2, RoomTypeId = 2, Status = RoomStatus.AVAILABLE, IsActive = true },
                new Room { RoomId = 6, Number = "301", Floor = 3, RoomTypeId = 3, Status = RoomStatus.AVAILABLE, IsActive = true }
            );


            modelBuilder.Entity<Amenity>().HasData(
                new Amenity { AmenityId = 1, Name = "WiFi", Description = "Darmowy szybki internet", IsActive = true },
                new Amenity { AmenityId = 2, Name = "Klimatyzacja", Description = "Klimatyzacja sterowana z pokoju", IsActive = true },
                new Amenity { AmenityId = 3, Name = "Kibel", Description = "Kibel", IsActive = true },
                new Amenity { AmenityId = 4, Name = "Minibar", Description = "Schłodzone napoje", IsActive = true }
            );

     
            modelBuilder.Entity<AdditionalOffer>().HasData(
                new AdditionalOffer { AdditionalOfferId = 1, Name = "Śniadanie (Bufet)", Price = 45m, IsActive = true },
                new AdditionalOffer { AdditionalOfferId = 2, Name = "Miejsce parkingowe", Price = 30m, IsActive = true },
                new AdditionalOffer { AdditionalOfferId = 3, Name = "Szampan", Price = 150m, IsActive = true },
                new AdditionalOffer { AdditionalOfferId = 4, Name = "Przedłużone wymeldowanie", Price = 100m, IsActive = true }
            );

    
            modelBuilder.Entity<Worker>().HasData(
                new Worker { WorkerId = 1, FirstName = "Adam", LastName = "Kowalski", Login = "admin", Password = "admin123", Role = Role.ADMIN, IsActive = true },
                new Worker { WorkerId = 2, FirstName = "Anna", LastName = "Nowak", Login = "anowak", Password = "user123", Role = Role.WORKER, IsActive = true }
            );

            modelBuilder.Entity<Guest>().HasData(
                new Guest { GuestId = 1, FirstName = "Mariusz", LastName = "Pudzianowski", Email = "pudzian@test.pl", PhoneNumber = "123567345", IdentityCardNumber = "ID123", IsActive = true },
                new Guest { GuestId = 2, FirstName = "Robert", LastName = "Lewandowski", Email = "robert@lewy.pl", PhoneNumber = "987654321", IdentityCardNumber = "PASS987", IsActive = true },
                new Guest { GuestId = 3, FirstName = "Iga", LastName = "Świątek", Email = "iga@tennis.pl", PhoneNumber = "555666777", IdentityCardNumber = "ID456", IsActive = true }
            );

            modelBuilder.Entity<Reservation>().HasData(

                new Reservation
                {
                    ReservationId = 1,
                    GuestId = 1,
                    RoomId = 4,
                    WorkerId = 1,
                    ReservationDate = new DateTime(2024, 1, 5),
                    CheckInDate = new DateTime(2024, 1, 10),
                    CheckOutDate = new DateTime(2024, 1, 12),
                    TotalPrice = 820m,
                    ReservationStatus = ReservationStatus.COMPLETED,
                    Notes = "Jakieś tam uwagi",
                    IsActive = true
                },

                new Reservation
                {
                    ReservationId = 2,
                    GuestId = 2,
                    RoomId = 2,
                    WorkerId = 2,
                    ReservationDate = new DateTime(2024, 3, 1),
                    CheckInDate = new DateTime(2024, 3, 15),
                    CheckOutDate = new DateTime(2024, 3, 20),
                    TotalPrice = 945m,
                    ReservationStatus = ReservationStatus.CONFIRMED,
                    Notes = "Testowa notatka",
                    IsActive = true
                },

                new Reservation
                {
                    ReservationId = 3,
                    GuestId = 3,
                    RoomId = 6,
                    WorkerId = 2,
                    ReservationDate = new DateTime(2024, 4, 1),
                    CheckInDate = new DateTime(2024, 5, 1),
                    CheckOutDate = new DateTime(2024, 5, 5),
                    TotalPrice = 2800m,
                    ReservationStatus = ReservationStatus.PENDING,
                    Notes = "VIP",
                    IsActive = true
                }
            );

     
            modelBuilder.Entity<ReservationAdditionalOffer>().HasData(

                new ReservationAdditionalOffer { ReservationAdditionalOfferId = 1, ReservationId = 1, AdditionalOfferId = 1, Quantity = 2, OfferPrice = 45m, Notes = "", IsActive = true },
                new ReservationAdditionalOffer { ReservationAdditionalOfferId = 2, ReservationId = 1, AdditionalOfferId = 2, Quantity = 1, OfferPrice = 30m, Notes = "Nr rej. WA12345", IsActive = true },
                new ReservationAdditionalOffer { ReservationAdditionalOfferId = 3, ReservationId = 2, AdditionalOfferId = 1, Quantity = 1, OfferPrice = 45m, Notes = "", IsActive = true }
            );

            modelBuilder.Entity<Payment>().HasData(
                new Payment { PaymentId = 1, ReservationId = 1, Title = "Opłata za pobyt (ID: 1)", Price = 820m, PaymentDate = new DateTime(2024, 1, 10), PaymentMethod = PaymentMethod.CARD, PaymentStatus = PaymentStatus.PAID },
                new Payment { PaymentId = 2, ReservationId = 2, Title = "Zaliczka rezerwacyjna", Price = 200m, PaymentDate = new DateTime(2024, 3, 1), PaymentMethod = PaymentMethod.MONEY, PaymentStatus = PaymentStatus.PAID },
                new Payment { PaymentId = 3, ReservationId = 3, Title = "Pełna opłata", Price = 2800m, PaymentDate = new DateTime(2024, 4, 1), PaymentMethod = PaymentMethod.TRANSFER, PaymentStatus = PaymentStatus.PENDING }
            );
        }

    }
}
