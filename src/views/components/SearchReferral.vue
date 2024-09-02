<template>
 <div class="mt-1 container d-flex justify-content-end">
      <div class="input-group w-25 ">
        <input
          type="text"
          class="form-control"
          placeholder="Buscar referido..."
          v-model="searchTerm"
          @input="debounceSearch"  
        >
      </div>
    </div>
</template>