import Api from '@/services/Api'

export default {
  records () {
    return Api().get('records')
  },

  addRecord (params) {
    return Api().post('add_record', params)
  },

  updateRecord (params) {
    return Api().put('records/' + params.id, params)
  },

  getRecord (params) {
    return Api().get('records/' + params.id)
  },

  deleteRecord (id) {
    return Api().delete('records/' + id)
  },

  searchRecord (params) {
    return Api().post('search', params)
  }
}
