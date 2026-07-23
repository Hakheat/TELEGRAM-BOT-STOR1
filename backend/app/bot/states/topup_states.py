from aiogram.fsm.state import State, StatesGroup


class TopUpStatesGroup(StatesGroup):
    waiting_for_amount = State()
    waiting_for_payment_confirm = State()
