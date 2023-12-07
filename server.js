// nodemon server.js
const express = require('express')
const app = express()

app.use(express.static(__dirname + '/public'))  // css 파일을 server에 등록하는 과정 (css,js,jpg 를 (static 파일이라 부른다))
app.set('view engine', 'ejs')


const { MongoClient } = require('mongodb') // 몽고디비 연결 세팅

let db
const url = 'mongodb+srv://admin:f1w1g1ek!!@jonghwayoo.wfpmbg7.mongodb.net/?retryWrites=true&w=majority'
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum')
  app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중')
})
}).catch((err)=>{
  console.log(err)
})



app.get('/', (요청, 응답) => {
    응답.sendFile(__dirname + '/index.html')
})

app.get('/myPage', (요청, 응답) => {
    응답.sendFile(__dirname + '/할수있다.html')
  
})

app.get('/news', (요청, 응답) => {
    db.collection('post').insertOne({title : '유종화'});
    응답.send('쇼핑페이지입니다.')
}) 

app.get('/list', async (요청, 응답) => {
   let result = await db.collection('post').find().toArray()
//    응답.send(result[0].title);
   
   응답.render('list.ejs',{ 글목록 : result})
}) 

app.get('/time',(요청,응답) => {
    응답.render('time.ejs',{ 시간 :new Date()})
})

// 1 누가 /shop 접속시 app.get() 함수 실행됨 
// 2 그다음 콜백 함수 실행 콜백함수 (줄임말(요청, 응답) => {})

// ejs 문법 정리

// <%= %> = html 사이에 자바스크립트 문법 쓸때 문자로 인식해서 <button></button 이 문자처럼출력된다
// <%- %> = include 문법 같이 특수한 기능을 사용할때 진짜 버튼이 출력

