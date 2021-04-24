const express = require('express');
const app = express();
const path = require('path');
//Allows semantic HTTP requests in HTML.
const methodOverride = require('method-override');
//UUID plugin to create unique IDs for each post.
const { v4:createId } = require('uuid');
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/views')));
app.use(methodOverride('_method'));

//Generates a post subtitle from post content
function getSubtitle(string) {
    const location = string.split(' ', 10).join(' ').length;
    if (location > 140){
        return string.slice(0,140);
    }
    return string.slice(0,location);
}

//Defines static example posts. Created posts are added to this array in the absence of a database.
    let posts = [
        {
            id: createId(),
            title: 'Sample Post 1',
            content: 'Elizabeth would not oppose such an injunction--and a moment’s consideration making her also sensible that it would be wisest to get it over as soon and as quietly as possible, she sat down again and tried to conceal, by incessant employment the feelings which were divided between distress and diversion. Mrs. Bennet and Kitty walked off, and as soon as they were gone, Mr. Collins began.',
            author: 'Jane Austen',
            date: 'Wed Jan 28 1813'
        },
        {
            id: createId(),
            title: 'Sample Post 2',
            content: 'They went out into the flickering, wind-blown sunlight and strolled down the dreary Euston Road. The passersby glanced in wonder at the sullen heavy youth who, in coarse, ill-fitting clothes, was in the company of such a graceful, refined-looking girl. He was like a common gardener walking with a rose.',
            author: 'Oscar Wilde',
            date: 'Sat Jul 8 1890'
        }
    ]

posts[0].subtitle = getSubtitle(posts[0].content);
posts[1].subtitle = getSubtitle(posts[1].content);


app.listen(3000, () => {
    console.log('Listening on port 3000...');
})

app.get('/', (req, res) => {
    res.redirect('/blog');
})

//Serves blog on GET request
app.get('/blog/', (req, res) => {
    console.log('Get request for /blog received.');
    res.render('blog.ejs', { posts });
})

//Adds new blog post on POST request
app.post('/blog', (req, res) => {
    console.log('Post request for /blog received.');
    const {title, content, author} = req.body;
    const rawDate = new Date();
    posts.unshift({id: createId(), title, content, author, date: rawDate.toDateString(), subtitle: getSubtitle(req.body.content)});
    res.redirect('/blog');
})

//Serves individual post selected by ID
app.get('/blog/:id', (req, res) => {
    const { id } = req.params;
    const post = posts.find(p => p.id === id);
    console.log(`Get request for post ID ${id} received.`)
    res.render('post.ejs', { post });
})

//Edits individual post selected by ID
app.patch('/blog/:id', (req, res) => {
    const { id } = req.params;
    const newPost = { 
        title: req.body.title, 
        content: req.body.content, 
        subtitle: getSubtitle(req.body.content)
    };
    const post = posts.find(p => p.id === id);
    post.title = newPost.title;
    post.content = newPost.content;
    post.subtitle = newPost.subtitle;
    console.log(`Patch request for post ID ${id} received.`)
    res.redirect(`/blog/${id}`);
})

//Removes individual post selected by ID
app.delete('/blog/:id', (req, res) => {
    const { id } = req.params;
    posts = posts.filter(p => p.id !== id);
    console.log(`Delete request for post ID ${id} received.`)
    res.redirect('/blog');
})