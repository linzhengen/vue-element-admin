<template>
  <div>
    <div style="font-weight: bold;">楽天市場</div>
    <el-form :rules="rules" :model="form" label-width="220px" label-position="left" size="mini">
      <el-form-item label="SMTP AUTH ID" prop="smtp_auth_id">
        <el-input v-model="form.smtp_auth_id" />
      </el-form-item>
      <el-form-item label="SMTP AUTH Password" prop="smtp_auth_password">
        <el-input v-model="form.smtp_auth_password" type="type" />
      </el-form-item>
      <el-form-item label="SMTP AUTH Password(確認)" prop="smtp_auth_password_confirm">
        <el-input v-model="form.smtp_auth_password_confirm" type="type" />
      </el-form-item>
      <el-form-item label="FTP ID" prop="smtp_auth_id">
        <el-input v-model="form.ftp_id" />
      </el-form-item>
      <el-form-item label="FTP Password" prop="smtp_auth_password">
        <el-input v-model="form.ftp_password" type="type" />
      </el-form-item>
      <el-form-item label="FTP Password(確認)" prop="smtp_auth_password_confirm">
        <el-input v-model="form.ftp_password_confirm" type="type" />
      </el-form-item>
      <el-form-item label="WebApiライセンスキー" prop="api_license_key">
        <el-input v-model="form.api_license_key" type="type" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'ShopRakuten',
  data() {
    return {
      form: {
        smtp_auth_id: undefined,
        smtp_auth_password: undefined,
        smtp_auth_password_confirm: undefined,
        ftp_id: undefined,
        ftp_password: undefined,
        ftp_password_confirm: undefined,
        api_license_key: undefined
      },
      rules: {
        smtp_auth_id: [{ required: true, message: '入力してください', trigger: 'blur' }],
        smtp_auth_password: [{ required: true, message: '入力してください', trigger: 'blur' }],
        smtp_auth_password_confirm: [{ required: true, message: '入力してください', trigger: 'blur' }],
        ftp_id: [{ required: true, message: '入力してください', trigger: 'blur' }],
        ftp_password: [{ required: true, message: '入力してください', trigger: 'blur' }],
        ftp_password_confirm: [{ required: true, message: '入力してください', trigger: 'blur' }],
        api_license_key: [{ required: true, message: '入力してください', trigger: 'blur' }]
      }
    }
  }
}
</script>

