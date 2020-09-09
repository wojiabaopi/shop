<template>
  <div class="login">
    <div class="login-item">
      <div class="img-warpper">
        <img src="../assets/img/vue.jpg" alt="">
      </div>
      <el-form :model="form"  class="login_form" label-width="50px">
        <el-form-item >
          <el-input placeholder="请输入账号" v-model="form.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item  >
          <el-input placeholder="请输入密码" show-password v-model="form.password" prefix-icon="el-icon-shopping-bag-2"></el-input>
        </el-form-item>
        <el-form-item class="form_button">
          <el-button @click="login" style="margin-left: -20px" type="primary" >登录</el-button>
          <el-button @click="reset" style="margin-left: 15px" type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
  export default {
    name: "Login",
    data(){
      return{
        form: {
          username: '',
          password: ''
        },
        info: null
      }
    },
    methods: {
      reset(){
        this.form.username = ''
        this.form.password = ''
      },
      login(){
        this.$http.post('/login',this.form).then( res => {
          this.info = res.data.meta
          console.log(res);
          if(this.info.status == 200){
            window.sessionStorage.setItem('token',res.data.data.token)
            this.$router.push('/home')
            this.$msg({
              type: 'success',
              message: this.info.msg,
              offset: 200
            })
          } else{
            this.$msg({
              type: 'error',
              message: this.info.msg,
              offset: 200
            })
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .login {
    position: relative;
    height: 100%;
    background-color: #2b4b6b;

    .login-item {
      width: 450px;
      height: 300px;
      background-color: #fff;
      border-radius: 3px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      .img-warpper {
        width: 130px;
        height: 130px;
        border-radius: 50%;
        border: 1px solid #eee;
        box-shadow: 0 0 10px #ddd;
        padding: 10px;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;

        img {
          height: 100%;
          width: 100%;
          border-radius: 50%;
          background-color: #eee;
        }
      }
    }
  }
.login_form{
  position: absolute;
  bottom: 10px;
  left: 45%;
  transform: translate(-50%);
  padding: 0 20px;
  box-sizing: border-box;
  width: 100%;
  .form_button{
    display: flex;
    justify-content: center;
  }
}

</style>