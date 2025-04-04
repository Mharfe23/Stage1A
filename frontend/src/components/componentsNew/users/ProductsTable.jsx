import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";


import Modal from "./Modal";

const BusinessTable = ({Businesslist,admin}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredProducts, setFilteredProducts] = useState(Businesslist);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [showEditModal, setshowEditModal] = useState(false);
	const [showDeleteModal,setshowDeleteModal] = useState(false);
	const [expandedDescriptions, setExpandedDescriptions] = useState({}); // Track which descriptions are expanded
	useEffect(() =>{
		setFilteredProducts(Businesslist);
	},[Businesslist]);


	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = Businesslist.filter(
			(product) => product.business_name.toLowerCase().includes(term) || product.website.toLowerCase().includes(term)
		);

		setFilteredProducts(filtered);
	};

	const handleEditClick = (product) => {
		setSelectedProduct(product);
		setshowEditModal(true);
	};

	const handleDeleteClick = (product)=>{
		setSelectedProduct(product);
		setshowDeleteModal(true);
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setSelectedProduct((prevProduct) => ({
			...prevProduct,
			[name]: value
			
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch('/api/org/crud/updateBusiness', {
				method: 'PUT', // Specify the request method as PUT
				headers: {
				  'Content-Type': 'application/json', // Set the content type to JSON
				},
				body: JSON.stringify(selectedProduct)
			  });
			 
			  if (!response.ok) {
				throw new Error(response.message);
			  }

			  toast.success("Modifié avec succés");
			
			  setshowEditModal(false); // Close modal after submission
		} catch (error) {
			console.log(error);
			toast.error(error.message)
		}
		// Update logic goes here (backend update or state update)
	
	};

	const handleDelete = async (e) =>{
		e.preventDefault();
		
		try {
			const response = await fetch('/api/org/crud/deleteBusiness', {
				method: 'DELETE', // Specify the request method as PUT
				headers: {
				  'Content-Type': 'application/json', // Set the content type to JSON
				},
				body: JSON.stringify({"business_id":selectedProduct.business_id})
			  });
			 
			  if (!response.ok) {
				throw new Error(response.message);
			  }

			  toast.success("Supprimé avec succés");
			
			  setshowDeleteModal(false); 
		} catch (error) {
			console.log(error);
			toast.error(error.message)
		}
			
	}
	const toggleDescription = (business_id) => {
		setExpandedDescriptions((prevState) => ({
		  ...prevState,
		  [business_id]: !prevState[business_id], // Toggle the expanded state
		}));
	  };


	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8 overflow-y-auto h-[80vh]'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Details Entreprise</h2>
				<div className='relative'>
					<input
						type='text'
						placeholder='Chercher une entreprise...'
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						onChange={handleSearch}
						value={searchTerm}
					/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Name
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Email
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Phone
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Website
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Description
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Category
							</th>
							
							{admin?<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Actions
							</th>:null}
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-700'>
						{filteredProducts.map((product) => (
							<motion.tr
								key={product.business_id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center'>
									<img
										src='https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww'
										alt='Product img'
										className='size-10 rounded-full'
									/>
									{product.business_name}
								</td>

								<td className='px-8 py-4 whitespace-nowrap text-sm text-gray-300'>
									{product.email}
								</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									{product.business_phone}
								</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									{product.website}
								</td>

								<td
									className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 cursor-pointer"
									onClick={() => toggleDescription(product.business_id)}
									>
									{/* Check if description is expanded */}
									{expandedDescriptions[product.business_id]
										? product.description // Show full description
										: product.description.slice(0, 40) + "..."} {/* Show shortened description */}
									</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									{product.business_category}
								</td>

								{admin?<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									<button className='text-indigo-400 hover:text-indigo-300 mr-2' onClick={() => handleEditClick(product)}>
										<Edit size={18} />
									</button>
									<button className='text-red-400 hover:text-red-300' onClick={()=> handleDeleteClick(product)}>
										<Trash2 size={18} />
									</button>
								</td>:null}
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
			{/* Modal for editing product */}
			<Modal show={showEditModal} onClose={() => setshowEditModal(false)} onSubmit={handleSubmit} >
				
				<h3 className="text-xl font-semibold mb-4 text-gray-600">Modifier cette entreprise</h3>
				
				<form  className="grid md:grid-cols-3  gap-6">
					
						<div className="mb-4">
						<label className="block text-black">Name</label>
						<input
							type="text"
							name="business_name"
							value={selectedProduct?.business_name || ""}
							onChange={handleInputChange}
							className="border rounded-lg px-3 py-2 w-full text-black"
						/>
						</div>
						<div className="mb-4">
							<label className="block text-black">Email</label>
							<input
								type="email"
								name="email"
								value={selectedProduct?.email || ""}
								onChange={handleInputChange}
								className="border rounded-lg px-3 py-2 w-full text-black"
							/>
						</div>
					<div>
						<div className="mb-4">
						<label className="block text-black">Phone</label>
						<input
							type="text"
							name="business_phone"
							value={selectedProduct?.business_phone || ""}
							onChange={handleInputChange}
							className="border rounded-lg px-3 py-2 w-full text-black"
						/>
					</div>
					</div>
					<div className="mb-4">
						<label className="block text-black">Website</label>
						<input
							type="text"
							name="website"
							value={selectedProduct?.website || ""}
							onChange={handleInputChange}
							className="border rounded-lg px-3 py-2 w-full text-black"
						/>
					</div>
					
					
					<div className="mb-4">
						<label className="block text-black">Description</label>
						<textarea
							name="description"
							value={selectedProduct?.description || ""}
							onChange={handleInputChange}
							className="border rounded-lg px-3 py-2 w-full text-black lg:h-28"
						/>
					</div>
					
					
				</form>
			</Modal>
			<Modal show ={showDeleteModal} onClose={()=> setshowDeleteModal(false)} onSubmit={handleDelete}>
				<p className="text-xl text-black">Est-t-vous sur de vouloir Supprimer <span className="text-red-500 font-semibold"> Definitivement </span> ce compte?</p>
			</Modal>
		</motion.div>
	);
};
export default BusinessTable;