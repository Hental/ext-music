const reg = /<a.*?>.*?<\/a>/g;
const str = "<p></p><p style=\"line-height: 16px;\"><img src=\"http://ueditor.baidu.com/ueditor/dialogs/attachment/fileTypeImages/icon_doc.gif\"/><a style=\"font-size:12px; color:#0066cc;\" href=\"/server/ueditor/upload/file/6.docx\" title=\"6.docx\">6.docx</a></p><p style=\"line-height: 16px;\"><img src=\"http://ueditor.baidu.com/ueditor/dialogs/attachment/fileTypeImages/icon_txt.gif\"/><a style=\"font-size:12px; color:#0066cc;\" href=\"/server/ueditor/upload/file/2.txt\" title=\"2.txt\">2.txt</a></p><p><br/></p>";

let res = str.match(reg);
res.forEach(v => {
  // console.log(v + '\n');
  console.log('  ... ');
  let href = v.match(/href=".*?(?=")/)[0].substr(6);
  let name = v.match(/>.*?(?=<)/)[0].substr(1);
  var index = name.lastIndexOf('.');
  var type = name.substr(index + 1, name.length);
  name = name.substr(0, index);

  console.log(href, name, type);
});
