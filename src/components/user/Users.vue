<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input clearable @clear="selectuser" v-model="queryinfo.query" placeholder="请输入内容">
            <el-button slot="append" @click="selectuser" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="dialogVisible = true" type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <template>
        <el-table
          :data="userlist"
          border
          stripe>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column
            prop="username"
            label="姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="电话">
          </el-table-column>
          <el-table-column
            prop="role_name"
            label="角色">
          </el-table-column>
          <el-table-column
            label="状态">
            <template v-slot="scope">
              <el-switch
                @change="statechange(scope.row)"
                v-model="scope.row.mg_state">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template width="180px" v-slot="scope">
              <el-button @click="selectUserInfo(scope.row.id)" size="mini" type="primary"
                         icon="el-icon-edit"></el-button>
              <el-button @click="deleteUser(scope.row.id)" size="mini" type="danger" icon="el-icon-delete"></el-button>
              <el-tooltip class="item" :enterable="false" effect="dark" content="分配角色" placement="top">
                <el-button @click="setRole(scope.row)" size="mini" type="warning" icon="el-icon-setting"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next"
        :total="total">
      </el-pagination>

    </el-card>

    <el-dialog
      @close="before"
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%">
      <el-form :model="addForm" :rules="addrules" ref="addFormref" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
      @close="before2"
      title="修改用户"
      :visible.sync="editdialogVisible"
      width="50%">
      <el-form :model="editUserInfo" :rules="editrules" ref="editFormref" label-width="70px">
        <el-form-item label="用户名">
          <el-input disabled v-model="editUserInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </span>
    </el-dialog>


    <el-dialog
      title="分配角色"
      :visible.sync="setdialogVisible"
      width="50%">
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>
          分配角色：
          <el-select @close="reset" v-model="value" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRole">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: "Users",
    data() {

      const checkEmail = (rule, value, cb) => {
        const re = /^\w+@[a-z0-9]+\.[a-z]{2,4}$/
        if (re.test(value)) {
          return cb()
        }
        cb(new Error('请输入合法的邮箱'))
      }
      const checkMobile = (rule, value, cb) => {
        const reg = /^1[3456789]\d{9}$/
        if (reg.test(value)) {
          return cb()
        }
        cb(new Error('请输入合法的手机号'))
      }

      return {
        queryinfo: {
          query: '',
          pagenum: 1,
          pagesize: 2
        },
        total: 0,
        value: '',
        userlist: [],
        dialogVisible: false,
        editdialogVisible: false,
        editrules: {
          emial: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {min: 6, max: 20, message: '长度为3-10'},
            {
              validator: checkEmail, trigger: 'blur'
            }
          ],
          mobile: [
            {required: true, message: '请输入手机', trigger: 'blur'},
            {min: 3, max: 11, message: '长度为3-11'},
            {
              validator: checkMobile, trigger: 'blur'
            }
          ]
        },
        editUserInfo: {},
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        addrules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 10, message: '长度为3-10'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 15, message: '长度为6-15'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {min: 6, max: 20, message: '长度为3-10'},
            {
              validator: checkEmail, trigger: 'blur'
            }
          ],
          mobile: [
            {required: true, message: '请输入手机', trigger: 'blur'},
            {min: 3, max: 11, message: '长度为3-11'},
            {
              validator: checkMobile, trigger: 'blur'
            }
          ]
        },
        userInfo: {},
        roleList: [],
        setdialogVisible: false
      }
    },
    methods: {
      selectuser() {
        this.$http.get('/users', {params: this.queryinfo}).then(res => {
          if (res.status == 200) {
            this.total = res.data.data.total
            this.userlist = res.data.data.users
          }
        })
      },
      reset() {
        this.value = ''
        this.userInfo = {}
      },
      saveRole() {
        if (!this.value){
          this.$msg({
            type: 'warning',
            message: '请选择角色',
            offset: 200
          })
        } else {
          this.$http.put(`/users/${this.userInfo.id}/role`,{
            rid: this.value
          }).then( res => {
            if(res.data.meta.status != 200){
              this.$msg({
                type: 'info',
                message: res.data.meta.msg,
                offset: 200
              })
            } else {
              this.$msg({
                type: 'success',
                message: res.data.meta.msg,
                offset: 200
              })

            }
          })
        }
          this.setdialogVisible = false
      }
      ,
      handleSizeChange(newSize) {
        this.queryinfo.pagesize = newSize
        this.selectuser()
      },
      handleCurrentChange(newPage) {
        this.queryinfo.pagenum = newPage
        this.selectuser()
      },
      statechange(info) {
        this.$http.put(`/users/${info.id}/state/${info.mg_state}`).then(res => {
          if (res.status == 200) {
            this.$msg({
              type: 'success',
              message: '修改状态成功',
              offset: 200
            })
          } else {
            info.mg_state = !info.mg_state
          }
        })
      },
      before() {
        // this.addForm.username = ''
        // this.addForm.password = ''
        // this.addForm.email = ''
        // this.addForm.mobile = ''
        this.$refs.addFormref.resetFields()
      },
      before2() {
        this.$refs.editFormref.resetFields()
      },
      addUser() {
        this.$refs.addFormref.validate(res => {
          if (!res) return
          this.$http.post('/users', this.addForm).then(res => {

            if (res.data.meta.status == 201) {
              this.selectuser()
              this.$msg({
                type: 'success',
                message: '添加用户成功',
                offset: 200
              })
            } else {
              this.$msg({
                type: 'error',
                message: '添加失败，' + res.data.meta.msg,
                offset: 200
              })
            }
            this.dialogVisible = false
          })
        })
      },
      selectUserInfo(id) {
        this.$http.get('/users/' + id).then(res => {
          this.editUserInfo = res.data.data
        })
        this.editdialogVisible = true
      },
      editUser() {
        this.$refs.editFormref.validate(res => {
          if (!res) return

          this.$http.put('/users/' + this.editUserInfo.id, {
            email: this.editUserInfo.email,
            mobile: this.editUserInfo.mobile
          }).then(res => {

            if (res.data.meta.status == 200) {
              this.selectuser()
              this.$msg({
                type: 'success',
                message: res.data.meta.msg,
                offset: 200
              })
            } else {
              this.$msg({
                type: 'error',
                message: '更新失败',
                offset: 200
              })
            }
          })
          this.editdialogVisible = false
        })
      },
      deleteUser(id) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('/users/' + id).then(res => {
            if (res.data.meta.status == 200) {
              this.selectuser()
              this.$msg({
                type: 'success',
                message: res.data.meta.msg,
                offset: 200
              })
            } else {
              this.$msg({
                type: 'warning',
                message: res.data.meta.msg,
                offset: 200
              })
              this.selectuser()
            }
          })
        }).catch(() => {
          this.$msg({
            type: 'info',
            message: '已取消删除',
            offset: 200
          });
        });
      },
      setRole(user) {
        this.userInfo = user

        this.$http.get('/roles').then(res => {
          if (res.data.meta.status == 200) {
            this.roleList = res.data.data
          }
        })
        this.setdialogVisible = true
      }
    },
    created() {
      this.selectuser()
    }
  }
</script>

<style lang="less" scoped>

  .el-breadcrumb {
    font-size: 12px;
    margin-bottom: 10px;
  }

  .el-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  }

  .el-table {
    font-size: 12px;
    margin-top: 15px;
  }

  .el-pagination {
    margin-top: 15px;
    margin-left: 50%;
    transform: translate(-50%);
  }
</style>