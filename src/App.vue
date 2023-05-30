<script setup>
</script>

<template>
  <header>
    <div class="dis-f p-1">
      <select id="profile-select">
        <option value="profile01">Profile 1</option>
        <option value="profile02">Profile 2</option>
        <option value="profile02">Profile 3</option>
      </select>
      <div class="p-1">
        <button>prev</button>
        <button>next</button>
      </div>
    </div>

  </header>
  <main class="dis-f">
    <div class="left-panel p-1">
      <img src="profile.png" />
    </div>
    <div class="right-panel p-1">
      <div class="name"> first name <span>Last name</span></div>
      <div class="meta dis-f">
        <div class="age">Age <span>10</span></div>
        <div class="country ">
          <div class="flag dis-f">
            <span>country </span>
            <div class="dis-f">
              <img src="bangladesh.png" />
            <span>bangladesh</span>
            </div>
          </div>
        </div>
      </div>
      <div class="category">
       <span>category</span> <img src="cat.png" />
      </div>
    </div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}
.dis-f {
  display: flex;
}
.dis-f-col {
  flex-direction: column;
}
.dis-f-row {
  flex-direction: row;
}
.p-1 {
  padding: 10px;
}
</style>
