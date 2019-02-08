class CreateQuizzes < ActiveRecord::Migration[5.0]
  def change
    create_table :quizzes do |t|
      t.string :quiz_type
      t.string :quiz_taker
      t.integer :score
      t.timestamps
    end
  end
end
