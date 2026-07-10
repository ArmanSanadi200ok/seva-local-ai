import random
from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from users.models import User
from users.constants import UserRole
from vendors.models import ServiceCategory, Vendor
from vendors.constants import AvailabilityStatus, VerificationStatus

class Command(BaseCommand):
    help = 'Seeds local Ichalkaranji demo vendors for matching flow'

    def handle(self, *args, **kwargs):
        # 1. Categories with common AI output slugs
        cats_data = [
            {"name": "Plumbing", "slug": "plumbing"},
            {"name": "Electrical", "slug": "electrical"},
            {"name": "Catering", "slug": "catering"},
            {"name": "Tailoring", "slug": "tailoring"},
            {"name": "Powerloom Repair", "slug": "powerloom-repair"},
            {"name": "Tiffin Service", "slug": "tiffin-service"},
            {"name": "House Cleaning", "slug": "house-cleaning"},
            {"name": "Painting", "slug": "painting"},
        ]
        
        categories = {}
        for c in cats_data:
            cat, _ = ServiceCategory.objects.get_or_create(
                slug=c["slug"], defaults={"name": c["name"], "is_active": True}
            )
            categories[c["slug"]] = cat
            
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(categories)} categories."))

        # 2. Dummy Vendors Data
        vendors_data = [
            {"business": "Shree Plumbers", "owner": "Ramesh", "slug": "plumbing", "area": "Kabnur"},
            {"business": "A1 Pipe Solutions", "owner": "Suresh", "slug": "plumbing", "area": "Shahupuri"},
            {"business": "Ichalkaranji Electricals", "owner": "Mahesh", "slug": "electrical", "area": "Rajwada"},
            {"business": "QuickFix Wiring", "owner": "Prakash", "slug": "electrical", "area": "Ichalkaranji"},
            {"business": "Sai Caterers", "owner": "Anand", "slug": "catering", "area": "Ichalkaranji"},
            {"business": "Mahalaxmi Pure Veg", "owner": "Kedar", "slug": "catering", "area": "Kabnur"},
            {"business": "Perfect Stitch Tailors", "owner": "Sneha", "slug": "tailoring", "area": "Shahupuri"},
            {"business": "Uniform World", "owner": "Pooja", "slug": "tailoring", "area": "Rajwada"},
            {"business": "Loom Master Repairs", "owner": "Bablu", "slug": "powerloom-repair", "area": "MIDC"},
            {"business": "Belt & Motor Fixers", "owner": "Kisan", "slug": "powerloom-repair", "area": "Kabnur"},
            {"business": "Ghar Ka Khana Tiffins", "owner": "Aarti", "slug": "tiffin-service", "area": "Shahupuri"},
            {"business": "Swad Tiffins", "owner": "Rani", "slug": "tiffin-service", "area": "Ichalkaranji"},
            {"business": "Sparkle Cleaning", "owner": "Vishal", "slug": "house-cleaning", "area": "Rajwada"},
            {"business": "DeepClean Pros", "owner": "Manoj", "slug": "house-cleaning", "area": "Kabnur"},
            {"business": "Colorful Walls", "owner": "Raju", "slug": "painting", "area": "Shahupuri"},
            {"business": "Shree Paints", "owner": "Amit", "slug": "painting", "area": "Ichalkaranji"},
        ]

        created_count = 0
        base_phone = 9876540000

        for i, vd in enumerate(vendors_data):
            phone = f"+91{base_phone + i}"
            
            # Create user
            user, created_user = User.objects.get_or_create(
                phone_number=phone,
                defaults={
                    "role": UserRole.VENDOR,
                    "first_name": vd["owner"],
                    "is_active": True,
                    "password": make_password("DemoPassword123!")
                }
            )

            # Create vendor
            cat = categories.get(vd["slug"])
            if cat:
                Vendor.objects.update_or_create(
                    user=user,
                    defaults={
                        "business_name": vd["business"],
                        "owner_name": vd["owner"],
                        "phone_number": phone,
                        "category": cat,
                        "subcategory": f"{cat.name} Specialist",
                        "city": "Ichalkaranji",
                        "area": vd["area"],
                        "address": f"Near Main Road, {vd['area']}",
                        "availability_status": AvailabilityStatus.AVAILABLE,
                        "verification_status": VerificationStatus.VERIFIED,
                        "rating": round(random.uniform(3.8, 5.0), 1),
                        "is_active": True
                    }
                )
                created_count += 1

        self.stdout.write(self.style.SUCCESS(f"Seeded {created_count} verified vendors for matching."))
