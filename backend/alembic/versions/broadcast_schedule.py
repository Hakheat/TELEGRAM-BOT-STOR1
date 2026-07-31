"""add broadcast schedule table

Revision ID: 2026_07_24_add_bc_sched
Revises: 2026_07_24_initial_schema
Create Date: 2026-07-24 19:30:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '2026_07_24_add_bc_sched'
down_revision: Union[str, None] = '2026_07_24_initial_schema'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'broadcast_schedules',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('title', sa.String(length=255), nullable=True),
        sa.Column('message_text', sa.Text(), nullable=False),
        sa.Column('image_path', sa.String(length=512), nullable=True),
        sa.Column('scheduled_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('interval_delay', sa.Integer(), nullable=False, server_default='3'),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='pending'),
        sa.Column('total_targets', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('sent_successfully', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('failed_or_blocked', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('sent_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('broadcast_schedules')
