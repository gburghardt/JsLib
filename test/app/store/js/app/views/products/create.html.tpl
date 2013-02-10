<form action="#" data-action-submit="save" data-action-change="markDirty" method="get">
	<h2>Create a Product</h2>

	<p>
		<label for="product-name-#{guid}">Name:</label>
		<input type="text" name="name" id="product-name-#{guid}" value="#{name}" size="40">
	</p>

	<p>
		<label for="product-description-#{guid}">Description:</label><br>
		<textarea cols="60" rows="12" name="description" id="product-description-#{guid}">#{description}</textarea>
	</p>

	<p>
		<label for="product-price-#{guid}">Price:</label>
		<input type="text" name="price" id="product-price-#{guid}" value="#{price}">
	</p>

	<p>
		<input type="hidden" name="id" value="#{id}">
		<input type="hidden" name="created_at" value="#{created_at}">
		<input type="hidden" name="updated_at" value="#{updated_at}">
		<button type="button" data-action="cancel">Cancel</button>
		<button type="submit">Save</button>
	</p>
</form>