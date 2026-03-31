using Microsoft.EntityFrameworkCore;

namespace HotelManageSys.API.Models.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }


        public DbSet<Room> Rooms { get; set; }
        public DbSet<RoomType> RoomTypes { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Amenity> Amenities { get; set; }
        public DbSet<HotelService> HotelServices { get; set; }
        public DbSet<Guest> Guests { get; set; }
        public DbSet<Worker> Workers { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<ReservationHotelService> ReservationHotelServices { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Room>(r =>
            {
                r.HasKey(r => r.RoomId);
                r.Property(r => r.Number).HasMaxLength(10).IsRequired();
                r.Property(r => r.Floor).HasMaxLength(2).IsRequired();

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

            modelBuilder.Entity<HotelService>(hs =>
            {
                hs.HasKey(hs => hs.HotelServiceId);
                hs.Property(hs => hs.Name).HasMaxLength(80).IsRequired();
                hs.Property(hs => hs.Price).HasColumnType("decimal(18,2)").IsRequired();
                hs.Property(hs => hs.IsActive).IsRequired();


            });

            modelBuilder.Entity<ReservationHotelService>(rhs =>
            {
                rhs.HasKey(rhs => rhs.ReservationHotelServiceId);
                rhs.Property(rhs => rhs.Quantity).IsRequired();
                rhs.Property(rhs => rhs.Notes).HasMaxLength(300);
                rhs.Property(rhs => rhs.IsActive).IsRequired();

                rhs.HasOne(rhs => rhs.Reservation)
                    .WithMany(r => r.ReservationHotelServices)
                    .HasForeignKey(rhs => rhs.ReservationId)
                    .OnDelete(DeleteBehavior.Restrict);

                rhs.HasOne(rhs => rhs.HotelService)
                   .WithMany(hs => hs.ReservationHotelServices)
                   .HasForeignKey(rhs => rhs.HotelServiceId)
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




        }
    }
}
