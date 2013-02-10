<form action="#" data-action-submit="save" data-action-change="markDirty" method="get">
	<h2>Create a Product</h2>

	<p>
		<label for="product-name-#{guid}">Name:</label><br>
		<input type="text" name="product[name]" id="product-name-#{guid}" value="#{name}">
	</p>

	<p>
		<label for="product-description-#{guid}">Description:</label><br>
		<textarea cols="60" rows="12" name="product[description]" id="product-description-#{guid}">#{description}</textarea>
	</p>

	<p>
		<input type="hidden" name="product[id]" value="#{id}">
		<input type="hidden" name="product[created_at]" value="#{created_at}">
		<input type="hidden" name="product[updated_at]" value="#{updated_at}">
		<button type="button" data-action="cancel">Cancel</button>
		<button type="submit">Save</button>
	</p>
</form>