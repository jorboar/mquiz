class CreateQuizzes < ActiveRecord::Migration[5.0]
  def change
    create_table :quizzes do |t|
      t.belongs_to :user, index: true
      t.string :quiz_type
      t.integer :user_id
      t.timestamps
    end
  end
end
