class CreateQuestions < ActiveRecord::Migration[5.0]
  def change
    create_table :questions do |t|
      t.belongs_to :quiz, index: true
      t.string :question_text
      t.boolean :result
      t.timestamps
    end
    
  end
end
