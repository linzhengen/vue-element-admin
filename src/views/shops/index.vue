<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="店舗名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" placeholder="ステータス" clearable class="filter-item" style="width: 130px">
        <el-option v-for="(statusName, statusKey) in statusMap" :key="statusKey" :label="statusName+'('+statusKey+')'" :value="statusKey" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        検索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新規
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="店舗名" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
          <el-tag>{{ row.mall_id | mallFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="開店日時" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.started_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新日時" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ステータス" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status == 2?'danger':'success'">
            {{ row.status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="left" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <router-link :to="{ name: 'ShopsEdit', params: { id: row.id }}">
            <el-button type="primary" size="small" icon="el-icon-edit">
              詳細設定
            </el-button>
          </router-link>
          <el-button v-if="row.status!='1'" size="mini" type="success" @click="handleModifyStatus(row,1)">
            有効に更新
          </el-button>
          <el-button v-if="row.status!='2'" size="mini" type="danger" @click="handleModifyStatus(row,2)">
            無効に更新
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="95px" style="width: 400px; margin-left:50px;">
        <el-form-item label="モール" prop="mall_id">
          <el-select v-model="temp.mall_id" class="filter-item" placeholder="選択してください" :disabled="dialogStatus==='update'">
            <el-option v-for="(mallName, mallKey) in malls" :key="mallKey" :label="mallName" :value="mallKey" />
          </el-select>
        </el-form-item>
        <el-form-item label="店舗名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="ステータス" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="選択してください">
            <el-option v-for="(statusName, statusKey) in statusMap" :key="statusKey" :label="statusName" :value="statusKey" />
          </el-select>
        </el-form-item>
        <el-form-item label="開店日時" prop="started_at">
          <el-date-picker v-model="temp.started_at" type="datetime" placeholder="日時を選択してください" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          キャンセル
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          登録
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createShop, updateShop } from '@/api/shop'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { MALLS } from '@/consts/mall'
import { STATUS_MAP } from '@/consts/shop'

export default {
  name: 'ShopsIndex',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: '有効',
        2: '無効'
      }
      return statusMap[status]
    },
    mallFilter(type) {
      return MALLS[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        mall_id: undefined,
        status: undefined,
        sort: '+id'
      },
      malls: MALLS,
      statusMap: STATUS_MAP,
      showReviewer: false,
      temp: {
        id: undefined,
        name: '',
        mall_id: undefined,
        status: undefined,
        started_at: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '更新',
        create: '新規'
      },
      rules: {
        mall_id: [{ required: true, message: '入力してください', trigger: 'change' }],
        name: [{ required: true, message: '入力してください', trigger: 'blur' }],
        status: [{ required: true, message: '入力してください', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
      })
      // todo delete
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: 'Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: undefined,
        mall_id: undefined,
        status: undefined,
        started_at: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          createShop(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.started_at = new Date(this.temp.started_at)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateShop(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    }
  }
}
</script>
