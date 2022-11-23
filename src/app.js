require("regenerator-runtime/runtime");
const dsteem = require('dsteem');
//const client = new dsteem.Client('https://api.steemit.com');
const client = new dsteem.Client('https://api.steememory.com');

function donokuraimae(date){
	date1 = new Date(date+"z");
	var now = new Date();
	sa = now - date1;
	// if(sa >= 86400000){return Math.floor(sa / 86400000)+'日前';}
	// if(sa >= 3600000){return Math.floor(sa / 3600000)+'時間前';}
	// if(sa >= 60000){return Math.floor(sa / 60000)+'分前';}
	// if(sa >= 1000){return Math.floor(sa / 1000)+'秒前';}
	// return 'たった今';
	if(sa >= 86400000){return Math.floor(sa / 86400000)+'days ago';}
	if(sa >= 3600000){return Math.floor(sa / 3600000)+'hours ago';}
	if(sa >= 60000){return Math.floor(sa / 60000)+'minutes ago';}
	if(sa >= 1000){return Math.floor(sa / 1000)+'seconds ago';}
	return 'just now';
}


function nannichimae(date){
	date1 = new Date(date+"z");
	var now = new Date();
	sa = now - date1;
	if(sa >= 86400000){return '-' + Math.floor(sa / 86400000);}
	return '';
}
      
const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
	
async function aaa(){
	let blogs = [];
	let total = 0;
	let limit = GETBLOG_LIMIT - 1;
	let entry_id = 0;
	let username = document.getElementById("username").value
	document.getElementById("text").innerHTML = '<tabel></tabel>';
	//件数取得
	//let ret = await client.api.getBlog(username, entry_id, 1);
	let ret = await client.database.call('get_blog', [username, entry_id, 1]);	

	if(ret.length == 0){
		document.getElementById("progress").innerText = ' データなし';	
		return [];
	}
	
	entry_id = ret[0].entry_id;
	total = entry_id + 1;
	document.getElementById("progress").innerText = ' 0 / ' + total;
	
	//投稿が１件だけの場合
	if(entry_id == 0){
		blogs = blogs.concat(ret);
		document.getElementById("progress").innerText = ' 1 / 1';	
		return ret;
	}
	
	while (entry_id != 0){
		if(blogs.length > 0){
			limit = GETBLOG_LIMIT;
		}
		if(entry_id + 1 < limit){
			limit = entry_id + 1;
		}
		let retry = 3;
		while(true){
			try{
				ret = await client.database.call('get_blog', [username, entry_id, limit]);	
				
				entry_id = ret[ret.length - 1].entry_id;
				if(entry_id != 0){
					ret.pop();
				} 
								
				for(var i=ret.length-1;i>=0;i=i-1){
					if(ret[i].comment.author != username){//Resteemなら
						ret.splice(i,1);
						total--; 
						continue;
					}
				}
				break;
			} catch(e) {
 				console.log( e.message );
				if(--retry == 0) {
					document.getElementById("progress").innerText = ' ' + blogs.length + ' / ' + total + " 未取得データあり";
					return blogs;
				}
				await _sleep(300);
			}
		}
		blogs = blogs.concat(ret);
		document.getElementById("progress").innerText = ' ' + blogs.length + ' / ' + total;
	}
	return blogs;
};


let stok_records = [];	
let start_index_stack = [];
let end_index;
window.clickBtn = async () => {
	let username = document.getElementById("username").value;
	window.location.hash = '#' + username;
	//初期設定
	start_index = 0;
	start_index_stack.length = 0;
	let now = new Date();
	//
	while (svg.lastChild) {
	   svg.removeChild(svg.lastChild);
	}
	aaa().then(result => {
		stok_records = result;//★保存
		makeTable(result);
		draw1(now);
		draw2(result,0,now);
		start_index_stack.push(0);
		setUsername(username);//クッキーに保存。
		userlink();
	}).catch(err => {
		console.log(err);
		document.getElementById("progress").innerText = JSON.stringify(err);
	});
};

window.clickBackBtn = async () => {
	if(end_index + 1 > stok_records.length - 1) return;
	while (svg.lastChild) {
	   svg.removeChild(svg.lastChild);
	}
	let index = end_index + 1;
	let cur = new Date(stok_records[index].comment.created+"z");
	draw1(cur);
	draw2(stok_records, index, cur);
	start_index_stack.push(index);
};

window.clickForwardBtn = async () => {
	if(start_index_stack.length <= 1) return;
	while (svg.lastChild) {
	   svg.removeChild(svg.lastChild);
	}
	start_index_stack.pop();
	let index = start_index_stack[start_index_stack.length-1];
	let cur = new Date(stok_records[index].comment.created+"z");
	draw1(cur);
	draw2(stok_records, index, cur);	
};

const months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
function formatDate(date){
	let date1 = new Date(date + "z");
	//return date1.getDate() + "." + months[date1.getMonth()] + "." + date1.getFullYear();
	return date1.getFullYear() + "." + months[date1.getMonth()] + "." + date1.getDate();
}
	
function makeTable(records){
	console.log('☆records☆');
	console.log(records);
	let html = '<table border=0>';
	for(let i=0; i<records.length; i=i+1){
		html +=　'<tr id=' + records[i].entry_id +'>';
		html += '<td align=right>' + records[i].entry_id + '</td>';
		html += '<td nowrap>' + formatDate(records[i].comment.created) + '</td>';
		html += '<td><a href=https://' + DOMAIN + records[i].comment.url + ' target=_blank>' + records[i].comment.title + '</a></td>';
		html += '<td align=right nowrap>' + donokuraimae(records[i].comment.created) + '</td>';
	}
	html += '</table>';
	document.getElementById("text").innerHTML = html;
}



if(!('DOMAIN' in window)){DOMAIN = 'steemit.com';}
const GETBLOG_LIMIT = 100;
const COLORS = ['#e8edf0', '#98e9a8', '#40c463', '#30a14e', '#216e39'];
	    
	    
    Date.prototype.getWeek = function() {
      var onejan = new Date(this.getFullYear(), 0, 1);
      return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    }

    Date.prototype.getWeek = function(year) {
      var onejan = new Date(year, 0, 1);
      return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    }
	function createText(x, y, s) {
		var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		text.setAttribute('x', x);
		text.setAttribute('y', y);
		text.setAttribute("fill", "#282828");
		text.setAttribute("font-family", "Arial");
		text.setAttribute("font-size", 12);
		text.textContent = s;
		return text;
	}
    
	function createRect(x, y, width, height, color, url, title, entryid) {
		//rect
		const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		rect.setAttribute('x', x);
		rect.setAttribute('y', y);
		rect.setAttribute('width', width);
		rect.setAttribute('height', height);
		rect.setAttribute('fill', color);
		rect.setAttribute('stroke', '#ffffff');
		rect.setAttribute('stroke-width', 2);
		if(url != "" ){
			rect.setAttribute("url", url);
			rect.onclick = setOnClick;
			
			rect.setAttribute("title", title);
			rect.onmousemove = showTooltip;
			rect.onmouseout = hideTooltip;
			rect.setAttribute("entryid", entryid);
		}
		return rect;
	}
    
	//ボックスを表示する
	function box(svg, x, y, width, height , color) {
		svg.appendChild(createRect(x, y, width, height, color,""/*url*/,""/*title*/,-1));
	}
	function boxAndClick(svg, x, y, width, height , color, url, title, update, entryid) {
		if(update){
			let lastChild = svg.lastElementChild;
			url = lastChild.getAttribute('url') + "\n" + url;
			title = lastChild.getAttribute('title') + "\n" + title;
			entryid = lastChild.getAttribute('entryid') + "\n" + entryid;
			svg.removeChild(lastChild);
		}
		svg.appendChild(createRect(x, y, width, height, color, url, title, entryid));
	}
		
	function text(svg, x, y, s) {
		svg.appendChild(createText(x, y, s));
	}    
    
	function setOnClick(e) {
		let urls = e.target.getAttribute('url').split('\n');
		//if(urls.length == 1){
		if(false){
			var a = document.createElement('a');
			a.href = urls[0];
			a.target = '_blank';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}
		else{
			let entryids = e.target.getAttribute('entryid').split('\n');
			entryids.forEach(function(id){
				document.getElementById(id).style.backgroundColor = COLORS[1];//'rgb(213,247,219)';//'#98e9a8';//cornsilk';
			})
			document.getElementById(entryids[0]).scrollIntoView({behavior: 'smooth', block: 'center'})
		}
      	}

	function boxHeaderAndBody(svg, headerSizeX, headerSizeY, size, startDate) {
		const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		// --- headr ---
  		box(svg, 0,0, headerSizeX, headerSizeY, 'white');
		// --- body ---
		const fullYear = startDate.getFullYear();
		const m = startDate.getMonth();
		const d = startDate.getDate();
		cur = new Date(fullYear,m,d);//00時00分00秒にする。
		cur.setDate(cur.getDate() + (6 - cur.getDay()));//開始日を微調整
		let x = headerSizeX - size;
		let y = headerSizeY;
		while (x >= 0) {
			for (let i = 0; i < 7; i++) {
				if (cur.getDate() == 1) {//月始めなら
					if(cur.getMonth() == 0){//1月なら
						text(svg, x, headerSizeY - 4, cur.getFullYear());
					}else{
						text(svg, x, headerSizeY - 4, monthNames[cur.getMonth()]);
					}
				}
				box(svg, x, y + i * size, size, size, "#f4f4f4");
          			cur.setDate(cur.getDate() - 1);//1日減算
			}
			x -= size;
		}
	}
 
//日付から座標インデックスを求める
    function getXY(curDate, startDate) {
	cur = new Date(curDate.getFullYear(),curDate.getMonth(),curDate.getDate());//00時00分00秒にする。
	start = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate());//00時00分00秒にする。
	    
      let day_cur = cur.getDay(); //0;sun - 6:sat
      let week_cur = cur.getWeek(2016);
      let week_start = start.getWeek(2016);
      let x = week_start - week_cur;
      let y = day_cur;
      return {x: x,y: y};
    }

//チャートを表示する
    function draw1(cur) {
	    	//全要素削除
		let clientRect = svg.getBoundingClientRect();
		let head = 20;
		let size = (clientRect.height - head) / 7;
		boxHeaderAndBody(svg, clientRect.width, head, size, cur);
    }
function draw2(records, index, cur) {
		//const colors = ['#e8edf0', '#98e9a8', '#40c463', '#30a14e', '#216e39'];
		let clientRect = svg.getBoundingClientRect();
		let head = 20;
		let size = (clientRect.height - head) / 7;
		let x = clientRect.width - size;
		let y = head;
		let lastP = {x:-1, y:-1, count: 0};
	    	for(let i=index; i<records.length; i=i+1){
			//let p = getXY(new Date(records[i].comment.created+"z"));//座標インデクスを求める
			let p = getXY(new Date(records[i].comment.created+"z"), cur);//座標インデクスを求める
			let wx = (clientRect.width - size) - p.x * size;//実際のx座標を求める
			if (wx < 0) {//範囲外なら描写しない
				end_index = i-1;//★保存
				return;
			}
			if(p.x == lastP.x && p.y == lastP.y){
				lastP.count++;
			}
			else{
				lastP.x = p.x;
				lastP.y = p.y;
				lastP.count = 1;
			}
			boxAndClick(svg, wx, y + p.y * size, size, size
				    , COLORS[(lastP.count > 4) ? 4 : lastP.count]
				    , "https://" + DOMAIN + records[i].comment.url
				    , records[i].comment.title
				    , (lastP.count > 1)//true:更新,false:追加
				    , records[i].entry_id 
				   );	
		}
		end_index = records.length - 1;
    }

function showTooltip(e) {
	let title = e.target.getAttribute('title');	
	let tooltip = document.getElementById("tooltip");
	tooltip.innerHTML = title.split('\n').join('<hr/>');
	tooltip.style.display = "block";
	tooltip.style.top = e.y + 10 + 'px';
	
	let document_w = document.documentElement.clientWidth
	let tooltip_w = parseInt(window.getComputedStyle(tooltip).width);
	let tooltip_h = parseInt(window.getComputedStyle(tooltip).height);
	let left = 0;
	if(e.pageX + 10 + tooltip_w < document_w - 20){
		left = e.pageX + 10;
	}else if(e.pageX - 10 - tooltip_w > 0){
		left = e.pageX - 10 - tooltip_w;
	}
	tooltip.style.left = left + 'px';
}

function hideTooltip(e) {
  var tooltip = document.getElementById("tooltip");
  tooltip.style.display = "none";
}

// ---------- userlink ----------
function setUsername(username){
    let nameList = getUsernames(); 
    let index = nameList.indexOf( username );
    if(index >= 0){
        nameList.splice(index, 1);  
    }
    nameList.push(username);
    document.cookie = "usernames=" + encodeURIComponent(nameList.join(",")) + ";max-age=86400";//60*60*24秒   
}
function getUsernames(){
    cookies = document.cookie;
    let lines = cookies.split(';');
    for(var line of lines){
        let elementList = line.split('=');
        let key = elementList[0];
        if( key != 'usernames'){continue;}
        let csv = decodeURIComponent(elementList[1]);        
        return csv.split(',');
    }
    return [];
}
function userlink(){
  let nameList = getUsernames();
  let s = "";
  let name = "";
  while(name = nameList.pop()){
  	s = s + "<a href=javascript:clickUserLink('" + name + "'); class=darkgray>" + name + "</a> ";
  }
  console.log(s);
  document.getElementById("userlink").innerHTML = s;
}

function clickUserLink(username){
	document.getElementById("username").value = username;
	clickBtn();
}

function clickAppLink(appname){
	username = document.getElementById("username").value;
	//location.href = appname + username;

	var a = document.createElement('a');
	a.href = appname + username;
	a.target = '_blank';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}
	
// ----------  ----------
function getUserName(){
  let hash = window.location.hash;// #username
  if (hash == null || hash.trim().length == 0){
	  return "";
  }
  hash = hash.substr(1);//#を取る
  hash = decodeURI(hash).trim();//デコード、トリム]
  return hash;
}

window.onload = function() {
	let username = getUserName();
	if(username == ''){
		let userList = getUsernames();//クッキーから取得。
		if(userList.length == 0) return;
		username = userList.pop();
	}
	document.getElementById("username").value = username;
	clickBtn();
};
