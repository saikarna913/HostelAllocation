from .auth import router as auth
from .hostels import router as hostels
from .rooms import router as rooms
from .sheets import router as sheets
from .students import router as students

__all__ = ["auth", "hostels", "rooms", "sheets", "students"]
