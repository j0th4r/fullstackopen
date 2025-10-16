const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];
const title = process.argv[3];
const author = process.argv[4];
const url = process.argv[5];
const likes = process.argv[6];

const uri = `mongodb+srv://fullstack:${password}@cluster0.xaw8lbt.mongodb.net/bloglistApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);

mongoose.connect(uri);

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model('Blog', blogSchema);

const blog = new Blog({
  title,
  author,
  url,
  likes,
});

blog.save().then((result) => {
  console.log(`added blog ${title} to bloglist`);
  mongoose.connection.close();
});

// if (!name && !number) {
//   Person.find({}).then((result) => {
//     console.log('phonebook:');
//     result.forEach((persons) => {
//       console.log(`${persons.name} ${persons.number}`);
//     });
//     mongoose.connection.close();
//   });
// }
