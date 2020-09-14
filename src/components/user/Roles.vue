<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button @click="addRoles" style="margin-bottom: 12px" type="primary">添加角色</el-button>
      <el-table
        :data="rolesList"
        border
        stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row    :class="['b_bottom',index1 == 0 ? 'b_top' : '','center']" v-for="(item1,index1) in scope.row.children " :key="item1.id">
              <el-col :span="5">
                <el-tag @close="deleteTag(scope.row,item1.id)"  closable>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row   :class="[index2 == 0 ? '' : 'b_top','center']" v-for="(item2,index2) in item1.children" :key="item2.id">
                  <el-col :span="6" >
                    <el-tag @close="deleteTag(scope.row,item2.id)" closable type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18" >
                    <el-tag closable @close="deleteTag(scope.row,item3.id)" type="warning" v-for="(item3,index3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column width="300px" label="操作">
          <template v-slot="scope">
            <el-button @click="editRoles(scope.row.id)" size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button @click="dele(scope.row.id)" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button @click="setRoles(scope.row)" size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      title="添加角色"
      @close="before"
      :visible.sync="adddialogVisible"
      width="50%">
      <el-form ref="form"   :model="rolesinfo" label-width="80px">
        <el-form-item  label="角色名称">
          <el-input v-model="rolesinfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="rolesinfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="adddialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="add">确 定</el-button>
   </span>
    </el-dialog>

    <el-dialog
      title="修改角色"
      :visible.sync="editdialogVisible"
      width="50%">
      <el-form ref="form2"  :model="editinfo" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="editinfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editinfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="edit">确 定</el-button>
   </span>
    </el-dialog>

    <el-dialog
      title="分配权限"
      @close="reset"
      :visible.sync="setdialogVisible"
      width="50%">
      <el-tree ref="tree1"  show-checkbox :default-checked-keys="defaultKeys"  node-key="id" default-expand-all :data="setinfo" :props="setProps"></el-tree>
      <span slot="footer"  class="dialog-footer">
    <el-button @click="setdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="set">确 定</el-button>
   </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Roles",
    data() {
      return {
        rolesList: [],
        adddialogVisible: false,
        rolesinfo: {
          roleName: '',
          roleDesc: ''
        },
        editdialogVisible: false,
        editinfo: {
          roleId: '',
          roleName: '',
          roleDesc: ''
        },
        setdialogVisible: false,
        setinfo: [],
        setProps: {
          children: 'children',
          label: 'authName'
        },
        defaultKeys: [],
        roleId: ''
      }
    },
    methods: {
      queryRoles() {
        this.$http.get('/roles').then(res => {
          if (res.data.meta.status == 200) {
            this.rolesList = res.data.data
          }
        })
      },
      addRoles() {
        this.adddialogVisible = true
      },
      add(){
        this.$http.post('/roles',this.rolesinfo).then( res => {
          if(res.data.meta.status == 201){
            this.$msg({
              type: 'success',
              message: res.data.meta.msg,
              offset: 200
            })
            this.queryRoles()
          } else{
            this.$msg({
              type: 'error',
              message: '创建失败',
              offset: 200
            })
          }
        })
        this.adddialogVisible = false
      },
      editRoles(id){
        this.$http.get('/roles/' + id).then( res => {
          if(res.data.meta.status == 200){
            this.editinfo = res.data.data
          }
        })
        this.editdialogVisible = true
      },
      before(){
        this.rolesinfo.roleDesc = ''
        this.rolesinfo.roleName = ''
      },
      edit(){
        this.$http.put('/roles/' + this.editinfo.roleId,this.editinfo).then( res => {
          if( res.data.meta.status == 200){
            this.editinfo = res.data.data
            this.queryRoles()
          }
        })
        this.editdialogVisible = false
      },
      dele(id){

        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('/roles/' + id).then( res => {
            if(res.data.meta.status == 200){
              this.$msg({
                type: 'success',
                message: '删除成功!',
                offset: 200
              });
              this.queryRoles()
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
      deleteTag(role,tagid){
        this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(`/roles/${role.id}/rights/${tagid}`).then( res => {
            if( res.data.meta.status == 200){
              this.$msg({
                type: 'success',
                message: '删除成功!',
                offset: 200
              });
              role.children = res.data.data
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
      set(){
        const keys = [this.$refs.tree1.getCheckedKeys(),this.$refs.tree1.getHalfCheckedKeys()]
        const idStr = keys.join(',')
        this.$http.post(`/roles/${this.roleId}/rights`,{
          rids: idStr
        }).then( res => {
          if(res.data.meta.status == 200){
            this.$msg({
              type: 'success',
              message: '分配成功',
              offset: 200
            })
            this.queryRoles()
          }
        })
        this.setdialogVisible = false
      },
      setRoles(role){
        this.roleId = role.id
        this.$http.get('/rights/tree').then( res => {

          if( res.data.meta.status == 200){

            this.setinfo = res.data.data
          }
        })
        this.deaf(role,this.defaultKeys)
        this.setdialogVisible = true
      },
      deaf(role,arr){
        if(!role.children){
         return arr.push(role.id)
        }
        role.children.forEach(item => this.deaf(item,arr))
      },
      reset(){
        this.defaultKeys = []
      }
    },
    created() {
      this.queryRoles()
    }
  }
</script>

<style lang="less" scoped>

  .el-breadcrumb {
    font-size: 12px;
  }

  .el-card {
    margin-top: 15px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  }

  .el-table {
    font-size: 12px;
  }
  .el-tag{
    margin-top: 7px;
    margin-bottom: 7px;
    margin-right: 5px;
  }

  .b_top{
    border-top: 1px solid #eee;
  }
  .b_bottom{
    border-bottom: 1px solid #eee;
  }
  .center{
    display: flex;
    align-items: center;
  }


</style>