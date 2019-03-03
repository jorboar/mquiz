class CreateBoardNodes < ActiveRecord::Migration[5.0]
  def change
    create_table :board_nodes do |t|
      t.integer :quiz_id
      t.timestamps
    end
  end
end
