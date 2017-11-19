
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
    username:'toy',
    password: '123',
    age:44,
    sex:'female',
    direction_of_work:'none',
  }), contentType: 'application/json; charset=utf-8'}, function (data) {
    alert("user added");
  });
  return false;
});
