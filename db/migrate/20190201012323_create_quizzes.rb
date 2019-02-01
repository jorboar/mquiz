class CreateQuizzes < ActiveRecord::Migration[5.0]
  def change
    create_table :quizzes do |t|
      t.string :quiz_id
      t.string :quiz_type

      t.integer :user_id
      t.timestamps
    end
  end
end
