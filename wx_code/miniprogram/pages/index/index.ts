Component({
  data: {
    showModal: false
  },
  methods: {
    addTap: function() {
      this.setData({
        showModal: true
      })
    },
  },
})
