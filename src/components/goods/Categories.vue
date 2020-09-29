<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button @click="addCate" class="b1" type="primary">添加分类</el-button>

      <tree-table :data="categoriesList" :columns="columns"
                  :selection-type="false"
                  :expand-type="false"
                  show-index
                  index-text="#"
                  border>
        <template v-slot:isok="scope">
          <i style="color: lightgreen" v-if="!scope.cat_deleted" class="el-icon-success"></i>
          <i style="color: red" v-else class="el-icon-error"></i>
        </template>

        <template v-slot:order="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag v-if="scope.row.cat_level === 1" type="success" size="mini">二级</el-tag>
          <el-tag v-if="scope.row.cat_level === 2" type="warning" size="mini">三级</el-tag>
        </template>

        <template v-slot:opt="scope">
          <el-button @click="editCategories(scope.row)" size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button @click="test(scope.row)" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[3, 4, 5, 6]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>


    <el-dialog
      title="添加分类"
      :visible.sync="adddialogVisible"
      width="50%">
      <el-form :model="addCateForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：" >
          <el-cascader
            v-model="value"
            :options="parentCate"
            :props="catePrpos"
            clearable
            @change="cascaderchange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="adddialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCategories">确 定</el-button>
  </span>
    </el-dialog>


    <el-dialog
      title="编辑"
      :visible.sync="editdialogVisible"
      width="50%%"
      >
      分类名称: <el-input
      style="width: 80%"
      placeholder="请输入分类"
      v-model="input1"
      clearable>
    </el-input>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="edit">确 定</el-button>
  </span>
    </el-dialog>




  </div>
</template>

<script>
  export default {
    name: "Categories",
    data() {
      return {
        id: 0,
        input1: '',
        editdialogVisible: false,
        parentCate: [],
        rules: {
          cat_name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'}
          ]
        },
        catePrpos: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children',
          expandTrigger: 'hover',
          checkStrictly: true
        },
        value: [],
        addCateForm: {
          cat_pid: 0,
          cat_name: '',
          cat_level: 0
        },
        adddialogVisible: false,
        queryinfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        categoriesList: [],
        total: 0,
        columns: [{
          label: '分类名称',
          prop: 'cat_name'
        },
          {
            label: '是否有效',
            type: 'template',
            template: 'isok'
          },
          {
            label: '排序',
            type: 'template',
            template: 'order'
          },
          {
            label: '操作',
            type: 'template',
            template: 'opt'
          }]
      }
    },
    methods: {
      test(row){
        this.$confirm('此操作将永久删除该该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('/categories/' + row.cat_id).then( res => {
            this.$msg({
              type: 'success',
              message: res.data.meta.msg,
              offset: 200
            })
            this.queryCategoriesList()
          })
        }).catch(() => {
          this.$msg({
            type: 'info',
            message: '已取消删除',
            offset: 200
          });
        });
      },
      edit(){
        this.$http.put(`/categories/` + this.id ,{
          cat_name: this.input1
        }).then( res => {
          if(res.data.meta.status == 200){
            this.$msg({
              type: 'success',
              message: res.data.meta.msg,
              offset: 200
            })
            this.queryCategoriesList()
            this.input1 = ''
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
      editCategories(row){
        this.id = row.cat_id
        this.editdialogVisible = true
      },
      addCategories(){
        this.$http.post('/categories',this.addCateForm).then( res => {
          if(res.data.meta.status == 201){
            this.queryCategoriesList()
            this.$msg({
              type: 'success',
              message: res.data.meta.msg,
              offset: 200
            })
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
      cascaderchange(){
        if(this.value.length > 0){
          this.addCateForm.cat_pid = this.value[this.value.length -1]
          this.addCateForm.cat_level = this.value.length
        } else {
          this.addCateForm.cat_pid = 0
          this.addCateForm.cat_level = 0
        }
      },
      selectParentCate(){
        this.$http.get('/categories',{
          params: {
            type: 2
          }
        }).then( res => {
          if(res.data.meta.status == 200){
            this.parentCate = res.data.data
          }
        })
      },
      addCate() {
        this.selectParentCate()
        this.value = []
        this.addCateForm.cat_name = ''
        this.adddialogVisible = true
      },
      queryCategoriesList() {
        this.$http.get('/categories', {
          params: this.queryinfo
        }).then(res => {
          if (res.data.meta.status == 200) {
            this.total = res.data.data.total
            this.categoriesList = res.data.data.result
          }
        })
      },
      handleSizeChange(newSize) {
        this.queryinfo.pagesize = newSize
        this.queryCategoriesList()
      },
      handleCurrentChange(newPage) {
        this.queryinfo.pagenum = newPage
        this.queryCategoriesList()
      }
    },
    created() {
      this.queryCategoriesList()
    }
  }
</script>

<style lang="less" scoped>

  .el-breadcrumb {
    font-size: 12px;
    margin-bottom: 15px;
  }

  .el-card {
    font-size: 12px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  }

  .b1 {
    margin-bottom: 15px;
  }
</style>