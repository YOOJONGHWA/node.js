// nodemon server.js
const express = require('express')
const app = express()
const methodOverride = require('method-override')
require('dotenv').config();

app.use(methodOverride('_method')) 
app.use(express.static(__dirname + '/public'))  // css 파일을 server에 등록하는 과정 (css,js,jpg 를 (static 파일이라 부른다))
app.set('view engine', 'ejs')
app.use(express.json())                         // 요청.body 를 하기위한 필수 
app.use(express.urlencoded({ extended: true }))

const { MongoClient, ObjectId } = require('mongodb') // 몽고디비 연결 세팅

let db
const url = process.env.MONGODB_URI;
new MongoClient(url).connect().then((client) => {
    console.log('DB연결성공')
    db = client.db('forum')
    app.listen(8080, () => {
        console.log('http://localhost:8080 에서 서버 실행중')
    })
}).catch((err) => {
    console.log(err)
})

app.get('/', (요청, 응답) => {
    응답.sendFile(__dirname + '/index.html')
})

app.get('/myPage', (요청, 응답) => {
    응답.sendFile(__dirname + '/할수있다.html')

})

app.get('/news', (요청, 응답) => {
    db.collection('post').insertOne({ title: '유종화' });
    응답.send('쇼핑페이지입니다.')
})

app.get('/list', async (요청, 응답) => {
    let result = await db.collection('post').find().toArray()
    //    응답.send(result[0].title);

    응답.render('list.ejs', { 글목록: result })
})

app.get('/time', (요청, 응답) => {
    응답.render('time.ejs', { 시간: new Date() })
})

// 1 누가 /shop 접속시 app.get() 함수 실행됨 
// 2 그다음 콜백 함수 실행 콜백함수 (줄임말(요청, 응답) => {})

// ejs 문법 정리

// <%= %> = html 사이에 자바스크립트 문법 쓸때 문자로 인식해서 <button></button 이 문자처럼출력된다
// <%- %> = include 문법 같이 특수한 기능을 사용할때 진짜 버튼이 출력

// 글작성 기능 순서
// 1. 글작성페이지에서 글써서 서버로 전송
app.get('/write', (요청, 응답) => {
    응답.render('write.ejs')
})
// 2. 서버는 글을 검사
app.post('/add', async (요청, 응답) => {

    try {
        if (요청.body.title == '') {
            응답.send('제목안적었는데')
        } else {
            // 3. 이상없으면 DB에 저장
            await db.collection('post').insertOne({ title: 요청.body.title, content: 요청.body.content })
            응답.redirect('/list')
        }
    }
    catch (e) {
        console.log(e);
        응답.status(500).send('서버오류')
    }
})

// 상세페이지 기능
// 1. 유저가 /detail/어쩌구 접속하면
app.get('/detail/:id', async (요청, 응답) => {
    try {
        let result = await db.collection('post').findOne({ _id : new ObjectId(요청.params.id) }) // 2. {_id:어쩌구} 글을 DB에서 찾아서
        if (result == null) {
            응답.status(400).send('그런 글 없음')
        } else {
            // 3. ejs 파일에 박아서 보내줌
            응답.render('detail.ejs', { result: result })
        }

    } catch (e) {
        응답.send('이상한거 넣지마라')
    }
})

// 수정 페이지 기능
// 1. 글마다 있는 수정버튼 누르면 글수정할 수 있는 페이지로 이동
app.get('/edit/:id', async (요청, 응답) => {

    let result = await db.collection('post').findOne({ _id: new ObjectId(요청.params.id) })
    응답.render('edit.ejs', { result: result })

})
// 2. 그 페이지엔 글의 제목과 내용이 이미 폼에 채워져있어야함


// 3. 전송누르면 그걸로 기존에 있던 document를 수정해줌 
app.put('/edit', async (요청, 응답) => {
   
    try {
        
        if(요청.body.id == '') {
            응답.send('_id 값이 존재 하지 않습니다.');
        }
        else if(요청.body.title == '') {
            응답.send('제목을 입력하세요');
        }
        else {
            await db.collection('post').updateOne({ _id: new ObjectId(요청.body.id) },
            {
                $set: { title: 요청.body.title, content: 요청.body.content }
            })
        }
        
    } catch (e) {
        console.log(e);
        응답.status(500).send('서버오류')
    }
    응답.redirect('/list')
}) 

app.post('/abc', async (요청, 응답) => {

    console.log('안녕')
    console.log(요청.body)
})