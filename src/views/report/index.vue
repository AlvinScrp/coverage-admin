<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="appNameDisplay" placeholder="应用名称" style="width: 200px" class="filter-item">
        <el-option v-for="item in appNameDisplayOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-input
        v-model="listQuery.buildNum"
        type="Number"
        placeholder="构建序号"
        style="width: 100px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <div class="filter-empty" />

      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreateReport">
        创建报告
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="60">
        <template slot-scope="scope"> {{ scope.$index }} </template>
      </el-table-column>
      <el-table-column align="center" label="应用名称" width="160">
        <template slot-scope="scope"> {{ appNameToDisplay(scope.row.appName ) }} </template>
      </el-table-column>
      <el-table-column align="center" label="构建序号">
        <template slot-scope="scope"> {{ scope.row.buildNum }} </template>
      </el-table-column>
      <el-table-column align="center" label="全量">
        <template slot-scope="scope"> {{ scope.row.increment ? "是" : "否" }} </template>
      </el-table-column>
      <el-table-column align="center" label="相对序号">
        <template slot-scope="scope">
          {{ scope.row.increment ? `${scope.row.relativebuildNum}` : " - " }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间" width="200">
        <template slot-scope="scope"> {{ scope.row.formatTime }} </template>
      </el-table-column>
      <el-table-column align="center" label="预览链接" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handlePreview(scope.row)">
            跳转
          </el-button>
          <el-button size="mini" @click="handleCopyLink(scope.row.previewUrl,$event)">
            复制
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="下载链接" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleDownload(scope.row)">
            下载
          </el-button>
          <el-button size="mini" @click="handleCopyLink(scope.row.downloadUrl,$event)">
            复制
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="listQuery.pageIndex"
      :page-sizes="pageSizeOptions"
      :page-size="listQuery.pageSize"
      layout="sizes, prev, pager, next"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog width="75%" top="30px" title="创建报告" :visible.sync="createReportDialogVisible">
      <report-create-dialog
        v-if="createReportDialogVisible"
        :app-name-display-prop="appNameDisplay"
        :build-num-prop="listQuery.buildNum"
        @dismiss="createReportDialogVisible = false"
        @create-success="handleCreateReportSuccess"
      />
    </el-dialog>
  </div>
</template>

<script>
import { getReportList } from '@/api/report'
import ReportCreateDialog from './report-create-dialog/index.vue'
import clip from '@/utils/clipboard' // use clipboard directly

export default {
  name: 'ReportTable',
  components: { ReportCreateDialog },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        pageSize: 10,
        pageIndex: 1,
        buildNum: '211'

      },
      total: 0,
      createReportDialogVisible: false,
      appNameDisplay: '蜂享家掌柜-Android',
      appNameOptions: ['FXJ', 'FXJ', 'HYK'],
      osTypes: ['Android', 'iOS', 'Android'],
      appNameDisplayOptions: ['蜂享家掌柜-Android', '蜂享家掌柜-iOS', '好衣库-Android'],
      pageSizeOptions: [5, 10, 20, 50]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      var { pageSize, pageIndex, buildNum } = this.listQuery
      var appIndex = this.appNameDisplayOptions.indexOf(this.appNameDisplay)
      var params = { pageIndex, pageSize, osType: this.osTypes[appIndex] }
      var appName = this.appNameOptions[appIndex]
      if (appName) {
        params.appName = appName
        var numInt = parseInt(buildNum, 10)
        if (numInt) {
          params.buildNum = numInt
        }
      }
      getReportList(params).then((response) => {
        console.log(response)
        var entry = response.entry
        this.list = entry.list
        this.listQuery.pageIndex = entry.pageNo
        this.listQuery.pageSize = entry.pageSize
        this.total = entry.count
        this.listLoading = false
      })
    },
    handleFilter() {
      this.fetchData()
    },
    handleCreateReport() {
      this.createReportDialogVisible = true
    },
    handleSizeChange(size) {
      console.log(`每页 ${size} 条`)
      this.listQuery.pageIndex = 1
      this.listQuery.pageSize = size
      this.fetchData()
    },
    handleCurrentChange(index) {
      console.log(`当前页: ${index}`)
      this.listQuery.pageIndex = index
      this.fetchData()
    },
    handlePreview(report) {
      console.log(`preview:${report.previewUrl}`)
      window.open(report.previewUrl, '_blank')
    },
    handleDownload(report) {
      console.log(`download:${report.downloadUrl}`)
      window.open(report.downloadUrl, '_blank')
    },
    handleCopyLink(url, event) {
      console.log('copylink')
      clip(url, event)
    },
    handleCreateReportSuccess(params) {
      console.log(params)
    },
    appNameToDisplay(appName) {
      var index = this.appNameOptions.indexOf(appName)
      return this.appNameDisplayOptions[index]
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  display: flex;
  padding-bottom: 10px;

  .filter-empty {
    flex-grow: 1;
  }

  .filter-item {
    margin-left: 10px;
  }
}
</style>
