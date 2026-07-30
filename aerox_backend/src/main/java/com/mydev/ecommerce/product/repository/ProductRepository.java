package com.mydev.ecommerce.product.repository;

import com.mydev.ecommerce.product.model.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("""
            select p.id
            from Product p
            where p.active = true
              and p.deleted = false
            order by p.displayOrder asc, p.id asc
            """)
    List<Long> findActiveProductIds(Pageable pageable);

    @Query("""
            select p.id
            from Product p
            where p.active = true
              and p.deleted = false
              and p.category.id = :categoryId
            order by p.displayOrder asc, p.id asc
            """)
    List<Long> findActiveProductIdsByCategoryId(
            @Param("categoryId") Long categoryId,
            Pageable pageable
    );

    @Query("""
            select p.id
            from Product p
            where p.deleted = false
            order by p.displayOrder asc, p.id asc
            """)
    List<Long> findAdminProductIds(Pageable pageable);

    @Query("""
            select distinct p
            from Product p
            left join fetch p.images
            left join fetch p.category
            where p.id in :ids
            """)
    List<Product> findProductsWithImagesByIds(
            @Param("ids") List<Long> ids
    );

    /*
     * Keep this existing method because WishlistService and possibly other
     * older services already use it.
     */
    @Query("""
            select distinct p
            from Product p
            left join fetch p.images
            left join fetch p.category
            where p.id = :id
              and p.active = true
              and p.deleted = false
            """)
    Optional<Product> findByIdWithImages(
            @Param("id") Long id
    );

    /*
     * Explicit active-product method used by the updated ProductService.
     *
     * Both this method and findByIdWithImages are intentionally retained.
     */
    @Query("""
            select distinct p
            from Product p
            left join fetch p.images
            left join fetch p.category
            where p.id = :id
              and p.active = true
              and p.deleted = false
            """)
    Optional<Product> findActiveByIdWithImages(
            @Param("id") Long id
    );

    /*
     * Admin can load non-deleted products even when they are inactive.
     */
    @Query("""
            select distinct p
            from Product p
            left join fetch p.images
            left join fetch p.category
            where p.id = :id
              and p.deleted = false
            """)
    Optional<Product> findAdminByIdWithImages(
            @Param("id") Long id
    );

    /*
     * Loads all active colour variants in one group for the customer PDP.
     */
    @Query("""
            select distinct p
            from Product p
            left join fetch p.images
            left join fetch p.category
            where p.active = true
              and p.deleted = false
              and upper(p.variantGroupCode) = upper(:groupCode)
            order by p.variantDisplayOrder asc,
                     p.displayOrder asc,
                     p.id asc
            """)
    List<Product> findActiveColorVariantsByGroupCode(
            @Param("groupCode") String groupCode
    );

    /*
     * Searches products that the admin can select while creating or editing
     * a colour-variant group.
     */
    @Query("""
            select distinct p
            from Product p
            left join fetch p.images
            left join fetch p.category
            where p.active = true
              and p.deleted = false
              and (:excludeProductId is null or p.id <> :excludeProductId)
              and (
                    :query = ''
                    or lower(p.title) like lower(concat('%', :query, '%'))
                  )
            order by p.title asc, p.id asc
            """)
    List<Product> searchActiveVariantCandidates(
            @Param("query") String query,
            @Param("excludeProductId") Long excludeProductId,
            Pageable pageable
    );

    /*
     * Prevent duplicate colour names inside the same colour group.
     */
    boolean existsByVariantGroupCodeIgnoreCaseAndColorNameIgnoreCaseAndIdNotAndDeletedFalse(
            String variantGroupCode,
            String colorName,
            Long excludedProductId
    );

    /*
     * Prevent one colour group from containing products from another category.
     */
    boolean existsByVariantGroupCodeIgnoreCaseAndCategory_IdNotAndDeletedFalse(
            String variantGroupCode,
            Long categoryId
    );

    @Query("""
            select coalesce(max(p.variantDisplayOrder), -1)
            from Product p
            where p.deleted = false
              and upper(p.variantGroupCode) = upper(:groupCode)
            """)
    Integer findMaxVariantDisplayOrderByGroupCode(
            @Param("groupCode") String groupCode
    );

    @Query("""
            select max(p.displayOrder)
            from Product p
            where p.deleted = false
            """)
    Integer findMaxDisplayOrder();
}