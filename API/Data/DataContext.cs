using DatingApp.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DataContext : IdentityDbContext<User, Role, int, IdentityUserClaim<int>, UserRole,
        IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<Value> Values { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<Photo> Photos { get; set; }

        public DbSet<Like> Likes { get; set; }

        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserRole>().HasKey(userRole => new {userRole.UserId, userRole.RoleId});
            modelBuilder.Entity<UserRole>().HasOne(userRole => userRole.User).WithMany(user => user.UserRoles)
                .HasForeignKey(userRole => userRole.UserId).IsRequired();
            modelBuilder.Entity<UserRole>().HasOne(userRole => userRole.Role).WithMany(role => role.UserRoles)
                .HasForeignKey(userRole => userRole.RoleId).IsRequired();

            modelBuilder.Entity<Like>().HasKey(l => new {l.LikeeId, l.LikerId});
            modelBuilder.Entity<Like>().HasOne(u => u.Likee).WithMany(u => u.Likers).HasForeignKey(l => l.LikeeId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Like>().HasOne(l => l.Liker).WithMany(u => u.Likees).HasForeignKey(l => l.LikerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>().HasOne(m => m.Sender).WithMany(u => u.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Message>().HasOne(m => m.Recipient).WithMany(u => u.MessagesRecieved)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}