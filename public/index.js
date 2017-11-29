
$('[name="login-form"]').on('submit', function() {
  console.log("here");
  var form = $(this);
  $('.error', form).html('');
  $.ajax({
    url: "/login",
    method: "POST",
    data: form.serialize(),
    success:function(data){
      if(data.login){
        console.log(data);
        if(data.name=="admin"){
          window.location.href = "/admin.html";
        }else
        window.location.href = "/home.html";
      }else{
        alert('incorrect response');
      }

    }
  });
  return false;
});

$(".reg").on('click',function(){
  $.post({url:'/addNewPerson', data: JSON.stringify({
    username:'admin',
    password: 'Ad00min',
    // age:44,
    // sex:'female',
    // direction_of_work:'none',
  }), contentType: 'application/json; charset=utf-8'}, function (data,err) {
    if(!err) alert("user added");
  });
  return false;
});
