<template>
  <div class="image-list">
    <div class="search-bar">
      <el-select v-model="searchParams.medium_id" placeholder="medium">
        <el-option
            v-for="item in mediumOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        ></el-option>
      </el-select>
      <el-select v-model="searchParams.category_id" placeholder="请选择">
        <el-option
            v-for="item in categoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        ></el-option>
      </el-select>
      <el-input
          placeholder="请输入内容"
          v-model="searchParams.keyword"
          class="input-with-select"
      >
        <template #append>
          <el-button icon="el-icon-search" @click="search"></el-button>
        </template>
      </el-input>
      <el-select v-model="searchParams.time_period" placeholder="时间">
        <el-option
            v-for="item in timePeriodOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        ></el-option>
      </el-select>
      <el-select v-model="searchParams.sort" placeholder="排序">
        <el-option
            v-for="item in sortOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        ></el-option>
      </el-select>
    </div>

    <div class="image-container">
      <div
          class="image-item"
          v-for="(post, index) in postList"
          :key="index"
      >
        <img :src="post.cover_image_src" :alt="post.user.nickname"/>
        <div class="image-info">
          <span class="date">{{ post.user.nickname }}</span>
          <span class="date">{{ post.pub_date }}</span>
          <span class="comments" @click="showCommentInput(index)">
            <i class="el-icon-chat-dot-round"></i>
            {{ post.comments_count }}
          </span>
          <span
              class="likes"
              :class="{ liked: post.liked }"
              @click="toggleLike(index)"
          >
            <i class="el-icon-star-on"></i>
            {{ post.likes_count }}
          </span>
        </div>
        <div class="comment-input" v-if="post.showCommentInput">
          <el-input
              :ref="'commentInput' + index"
              v-model="post.commentInput"
              placeholder="请输入评论"
              @keyup.enter="submitComment(index)"
          ></el-input>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {listPost, commentPost, likePost,getCategoryOptions,getMediumOptions,getSystemOptions} from '@/api';

export default {
  data() {
    return {
      postList: [],
      searchInput: "",
      medium_id: "",
      mediumOptions: [],
      category_id: "",
      categoryOptions: [],
      time_period: "",
      timePeriodOptions: [],
      sort: "",
      sortOptions: [],
      searchParams:{
        medium_id: "",
        category_id: "",
        keyword: "",
        time_period: "",
        sort: "",
      },
      commentInputRefs: [],
    };
  },
  watch: {
    searchParams: {
      handler() {
        this.loadPostList();
      },
      deep: true
    }
  },
  methods: {
    search() {
      // 调用 API 搜索图片
    },
    showCommentInput(index) {
      this.postList[index].showCommentInput = true;
      this.$nextTick(() => {
        this.$refs['commentInput' + index][0].focus();
      });
    },
    toggleLike(index) {
      this.postList[index].liked = !this.postList[index].liked;
      likePost(this.postList[index].id).then(() => {
        //this.postList[index].likes += 1;
        this.loadPostList();
      })
    },
    submitComment(index) {
      this.postList[index].showCommentInput = false;
      commentPost(this.postList[index].id, this.postList[index].commentInput).then(() => {
        //this.postList[index].comments += 1;
        this.loadPostList();
      });
    },
    // reload posts list 在这个测试场景中，非常适合
    loadPostList() {
      listPost(this.searchParams).then((res) => {
        this.postList = res.data;
      });
    },
  },

  mounted() {
    this.loadPostList();
    getCategoryOptions().then((res) => {
      this.categoryOptions = res.data;
      console.log('categoryOptions',this.categoryOptions )
    });
    getMediumOptions().then((res) => {
      this.mediumOptions = res.data;
      console.log('mediumOptions',this.mediumOptions )

    });
    getSystemOptions().then((res) => {
      this.sortOptions = res.data.sort;
      this.timePeriodOptions = res.data.time_period;
      console.log('sortOptions',this.sortOptions )
      console.log('timePeriodOptions',this.timePeriodOptions )
    });
  },
};
</script>
<style scoped>
.image-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.image-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.image-item {
  position: relative;
  margin: 10px;
  width: 300px;
  height: 300px;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-info {
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 5px;
}

.date {
  font-size: 12px;
}

.comments,
.likes {
  font-size: 12px;
  cursor: pointer;
}

.likes.liked {
  color: red;
}

.comment-input {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>