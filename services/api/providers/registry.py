from . import stripe
from . import github
from . import razorpay
from . import shopify
from . import slack
from . import discord
from . import notion
from . import supabase

PROVIDERS = {
    "stripe": stripe,
    "github": github,
    "razorpay": razorpay,
    "shopify": shopify,
    "slack": slack,
    "discord": discord,
    "notion": notion,
    "supabase": supabase,
}