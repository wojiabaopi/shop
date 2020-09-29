<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        show-icon

        title="注意： 只允许为第三级分类设置参数"
        type="warning"
        :closable="false">
      </el-alert>

      <el-row>
        <el-col>
          选择商品分类:
          <el-cascader
            v-model="value"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button class="btn1" @click="addParams" :disabled="isActive" size="mini" type="primary">动态参数</el-button>
          <el-table
            :data="manyData"
            border
            stripe
            style="width: 100%">
            <el-table-column  type="expand">
              <template v-slot="scope">
                <el-tag @close="handclose(index,scope.row)" closable v-for="(item,index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="动态参数"
              width="300">
            </el-table-column>
            <el-table-column label="操作" >
              <template v-slot="scope">
                <el-button size="mini" @click="edit(scope.row)" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" @click="deleteParams(scope.row)" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button class="btn1" @click="addParams" :disabled="isActive" size="mini" type="primary">静态属性</el-button>
          <el-table
            :data="onlyData"
            border
            stripe
            style="width: 100%">
            <el-table-column  type="expand">
              <template v-slot="scope">
                <el-tag @close="handclose(index,scope.row)" closable v-for="(item,index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="静态属性"
              width="300">
            </el-table-column>
            <el-table-column label="操作" >
              <template v-slot="scope">
                <el-button size="mini" @click="edit(scope.row)" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" @click="deleteParams(scope.row)"  type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>


    <el-dialog
      @close="reset"
      :title="'添加' + getTitle"
      :visible.sync="adddialogVisible"
      width="50%">
      <el-form :model="addForm"  ref="addruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="getTitle" >
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="adddialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="add">确 定</el-button>
  </span>
    </el-dialog>


    <el-dialog
      title="修改"
      :visible.sync="editdialogVisible"
      width="50%">
      <el-form :model="editForm"  ref="editForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="输入名称" >
          <el-input v-model="editForm.value"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "Params",
    data() {
      return {
        inputValue: '',
        inputVisible: false,
        editForm: {
          value: '',
          id: ''
        },
        addForm: {
          attr_name: '',
        },
        editdialogVisible: false,
        adddialogVisible: false,
        manyData: [],
        onlyData: [],
        activeName: 'many',
        cateList: [],
        cateProps: {
          label: 'cat_name',
          value: 'cat_id',
          children: 'children',
          expandTrigger: 'hover'
        },
        value: []
      }
    },
    computed: {

      isActive() {
        if (this.value.length !== 3) {
          return true
        }
        return false
      },
      cateId() {
        if (this.value.length == 3) {
          return this.value[2]
        }
        return null
      },
      getTitle(){
        if( this.activeName == 'many'){
          return '动态参数'
        }
        return '静态属性'
      }
    }
    ,
    methods: {
      handclose(i,row){
        row.attr_vals.splice(i,1)
        this.$http.put(`/categories/${this.cateId}/attributes/${row.attr_id}`,{
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }).then( res => {
          if(res.data.meta.status == 200){
            this.$msg({
              type: 'success',
              message: '删除成功',
              offset: 200
            })
          }
        })
      },
      showInput(row){
        row.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm(row){
        if(row.inputValue.trim().length == 0){
          row.inputValue = ''
          row.inputVisible = false
          return
        }
        row.attr_vals.push(row.inputValue.trim())
        this.$http.put(`/categories/${this.cateId}/attributes/${row.attr_id}`,{
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }).then( res => {
          if(res.data.meta.status == 200){
            this.$msg({
              type: 'success',
              message: '添加成功',
              offset: 200
            })
          }
        })
        row.inputVisible = false
      },
      deleteParams(row){
        this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(`/categories/${this.cateId}/attributes/${row.attr_id}`).then( res => {
            if(res.data.meta.status == 200){
              this.$msg({
                type: 'success',
                message: res.data.meta.msg,
                offset: 200
              })
              this.getParams()
            } else {
              this.$msg({
                type: 'error',
                message: res.data.meta.msg,
                offset: 200
              })
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
      editParams(){
        this.$http.put(`/categories/${this.cateId}/attributes/${this.editForm.id}`,{
          attr_name: this.editForm.value,
          attr_sel: this.activeName
        }).then( res => {
          if(res.data.meta.status == 200){
            this.$msg({
              type: 'success',
              message: '更新成功',
              offset: 200
            })
            this.getParams()
          } else {
            this.$msg({
              type: 'error',
              message: res.data.meta.msg,
              offset: 200
            })
          }
        })
        this.editdialogVisible = false
      },


      edit(row){
        this.$http.get(`/categories/${this.cateId}/attributes/${row.attr_id}`,{
          attr_sel: this.activeName
          }
        ).then( res => {
          if(res.data.meta.status == 200){
            this.editForm.value = res.data.data.attr_name
            this.editForm.id = res.data.data.attr_id
          }
        })
        this.editdialogVisible = true
      },

      add(){

        this.$http.post(`/categories/${this.cateId}/attributes`,{
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        }).then( res => {
          if(res.data.meta.status == 201){
            this.$msg({
              type: 'success',
              message: res.data.meta.msg,
              offset:200
            })
            this.getParams()
          } else {
            this.$msg({
              type: 'error',
              message: res.data.meta.msg,
              offset: 200
            })
          }
        })


        this.adddialogVisible = false
      },
      reset(){
        this.addForm.attr_name = ''
      },
      addParams(){
        this.adddialogVisible = true
      },
      handleClick() {
        this.getParams()
      },
      queryCate() {
        this.$http.get('/categories').then(res => {
          if (res.data.meta.status == 200) {
            this.cateList = res.data.data
          }
        })
      },
      handleChange() {

        this.getParams()
      },
      getParams() {
        if (this.value.length !== 3) {
          this.value = []
          this.manyData = []
          this.onlyData = []
          return
        }
        this.$http.get(`/categories/${this.cateId}/attributes`, {
          params: {
            sel: this.activeName
          }
        }).then(res => {
          res.data.data.forEach(item => {
            item.attr_vals = item.attr_vals ?  item.attr_vals.split(' ') : []
            item.inputVisible = false
            item.inputValue = ''
          })
          if (res.data.meta.status == 200) {
            if (this.activeName == 'many') {
              this.manyData = res.data.data
            } else {
            }
            this.onlyData = res.data.data
          }

        })
      }
    },
    created() {
      this.queryCate()
    }
  }
</script>

<style lang="less" scoped>

  .el-breadcrumb {
    font-size: 12px;
    margin-bottom: 15px;
  }

  .el-row {
    margin: 15px 0;
  }

  .el-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  }
  .btn1 {
    margin-bottom: 10px;
  }
  .el-tag {
    margin-left: 10px;
  }
  .input-new-tag {
    width: 100px;
  }
</style>