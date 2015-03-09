"""map and model filenames

Revision ID: 2fa3ddaaec0
Revises: f1493fffe7
Create Date: 2015-03-06 13:20:46.972479

"""

# revision identifiers, used by Alembic.
revision = '2fa3ddaaec0'
down_revision = 'f1493fffe7'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('jobs', sa.Column('mapfilename', sa.String(), nullable=True))
    op.add_column('jobs', sa.Column('modelfilename', sa.String(), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('jobs', 'modelfilename')
    op.drop_column('jobs', 'mapfilename')
    ### end Alembic commands ###