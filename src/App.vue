<template>
  <div class="container mt-5 d-flex flex-column">
    <div class="form-group d-flex justify-content-center align-items-center my-2">
      <input class="form-control" @change="changeFile($event)" type="file" placeholder="загрузить файл"  accept="image/*"/>
      <input class="form-control mx-2" type="text" placeholder="написать текст" v-model="titleUploadFile" @keydown.enter="setUploadFile">
      <button class="btn btn-info" @click="setUploadFile">загрузить</button>
    </div>
    <hr class="w-100">
    <strong class="text-danger d-flex" v-if="loading">Загрузка...</strong>
    <div class="content d-flex flex-column justify-content-center align-items-center w-100" v-else>
      <div class="text-primary">{{fileList.length}}</div>
      <strong v-show="fileList?.length < 1">Загруженных файлов нет!</strong>
      <div v-for="item in fileList" :key="item">
        <div class="img-item d-flex justify-content-between align-items-center w-100">
          <p>{{item.name.split('.').slice(0,-1).join('')}}</p>
          <img :src="item.url" :alt="item.name" class="img"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref , onMounted, computed} from 'vue'
import { storage } from './firebase.js'
import {ref as fbRef, uploadBytes, listAll, getDownloadURL} from 'firebase/storage'

export default {
  setup () {
    const uploadFile = ref(null)
    const titleUploadFile = ref('')
    const fileListFbRef = fbRef(storage, 'upload/')
    const fileList = ref([])
    const loading = ref(false)

    const getAllFiles =  async () => {
      await listAll(fileListFbRef).then((res) => {
        fileList.value = []
        res.items.forEach((item) => {
          getDownloadURL(item).then((url) => {
            fileList.value.unshift({ url, name: item.name })
          })
        })
      })
    }

    onMounted( async () => {
     await getAllFiles()
    })
    console.log(fileList.value)
    const changeFile = (e) => {
      uploadFile.value = e.target.files[0]
    }
    const setUploadFile = async () => {
      if (uploadFile.value === null || titleUploadFile.value === '') return false
      loading.value = true
      const fileRef = fbRef(storage, `upload/${titleUploadFile.value}.${(uploadFile.value.name).split('.').pop()}`)
      await uploadBytes(fileRef, uploadFile.value)
      await getAllFiles()
      titleUploadFile.value = ''
      loading.value = false
        // alert('загружено')
    }
    return {
      setUploadFile,
      changeFile,
      uploadFile,
      titleUploadFile,
      fileList,
      loading
    }
  }
}
</script>

<style scoped>

</style>
