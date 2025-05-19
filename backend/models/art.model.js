import mongoose from 'mongoose';

const artSchema = new mongoose.Schema({
  
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
  
}, {
  timestamps: true
});

const Art= mongoose.model('Art', artSchema);
export default Art;
